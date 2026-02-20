import { apiUrl } from './App';
import Cookies from 'universal-cookie';
import * as eventsource from "eventsource-client";
import { Component as ReactComponent } from 'react';
import { HTTP_STATUS } from './Enums/HttpStatusCodes';
import { refreshAccessTokens } from './refreshLock';

interface FetchOptions {
  dest?: string;
  rawResponse?: boolean;
  isRetry?: boolean;
}

interface ApiResponse {
  success: boolean;
  status?: number;
  content?: Record<string, any>;
  msg?: string;
  headers?: Record<string, string>;
  errorMessage?: string;
}

interface User {
  user_id: string;
  [key: string]: any;
}

interface Role {
  role_id: string;
  role_name: string;
}

interface Rubric {
  rubric_id: string;
  rubric_name: string;
}

interface Category {
  category_id: string;
  rubric_id: string;
  [key: string]: any;
}

interface AssessmentTask {
  assessment_task_id: string;
  unit_of_assessment: string;
}

interface CourseRole {
  course_id: string;
  role_id: string;
}

export async function genericResourceGET(
  fetchURL: string,
  resource: string,
  component: ReactComponent<any, any>,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, resource, component, "GET", null, options);
}

export async function genericResourcePOST(
  fetchURL: string,
  component: ReactComponent<any, any>,
  body: string,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "POST", body, options);
}

export async function genericResourcePUT(
  fetchURL: string,
  component: ReactComponent<any, any>,
  body: string,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "PUT", body, options);
}

export async function genericResourceDELETE(
  fetchURL: string,
  component: ReactComponent<any, any>,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "DELETE", null, options);
}

function createApiRequestUrl(fetchURL: string, cookies: Cookies): string {
  const user = cookies.get('user') as User;
  const hasQueryParams = fetchURL.indexOf('?') > -1;
  const separator = hasQueryParams ? '&' : '?';
  return apiUrl + fetchURL + `${separator}user_id=${user.user_id}`;
}

async function genericResourceFetch(
  fetchURL: string,
  resource: string | null,
  component: ReactComponent<any, any>,
  type: string,
  body: string | null,
  options: FetchOptions = {}
): Promise<any> {
  const {
    dest = resource,
    rawResponse = false,
    isRetry = false
  } = options;

  const cookies = new Cookies();
  const accessToken : string = cookies.get('access_token');
  const refreshToken: string = cookies.get('refresh_token');
  const user: string = cookies.get('user');

  if (!accessToken || !refreshToken || !user){
    const state: any = {
      isLoaded: true,
      errorMessage: "Not authenticated",
    };

    component.setState(state);
    return state;
  }

  const url: string = createApiRequestUrl(fetchURL, cookies);
  const headers: Record<string, string> = {"Authorization": "Bearer " + accessToken};

  if (url.indexOf('bulk_upload') === -1) {
    headers["Content-Type"] = "application/json";
  }

  let response: Response;

  // try block handles network related errors.
  try {
    const fetchInit: RequestInit = {
      method: type,
      headers: headers
    };

    if (body !== null) {
      fetchInit.body = body;
    }

    response = await fetch(url, fetchInit);
  } catch(error){
    component.setState({
      isLoaded: true,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    throw error;
  }

  const result: ApiResponse = await response.json();

  if (result.success){
    const state: any = {
      isLoaded: true,
      errorMessage: null,
    };

    if (resource && result.content) {
      state[dest || resource] = result.content[resource][0];
    }

    component.setState(state);
    return rawResponse ? result : state;

  } else {
    // Catch and report server related errors.

    let tokenErrorResult: null|undefined|Promise<any> = await handleTokenErrorsAndRetry(result, resource, component, 
                                                      cookies, response, isRetry, 
                                                     fetchURL, type, body, options);

    if (tokenErrorResult === null) {
      const state = {
        isLoaded: true,
        errorMessage: result?.msg ?? "Server error",
      }
      component.setState(state);
    
    return tokenErrorResult;
  }
}


//function sleep(ms:number){
//  return new Promise(resolve => setTimeout(resolve, ms));
//}

/**
 * The function figures out we can retry a request that errored out from a token problem. If it is a hard
 * failure, the function will remove the tokens when needed and reaload the window to login view. Note that 
 * upon reciving a request that already failed once due to token errors the window will reload.
 * 
 * @param result - The result from the server.
 * @param resource - Connection destination.
 * @param component - Components state to set.
 * @param cookies - Cookies.
 * @param response - Response data sent.
 * @param isRetry - If allowed to attempt the same message.
 * @param fetchURL - URL to connect to.
 * @param type - Type of connection.
 * @param body - Message contained from the response.
 * @param options - Fetch options.
 * 
 * @returns Will return either null, undefined, or a Promise<any>. A undefined return means that a refresh will happen as 
 * new tokens are needed from login. A return of null means that the problem is not a token error. A return of a promise
 * means that the failed fetch has been refired and you have been handed that retried fetch.
 */
async function handleTokenErrorsAndRetry(
  result: ApiResponse, resource: string|null, 
  component: ReactComponent<any, any, any>, 
  cookies: Cookies, response: Response,
  isRetry: boolean, fetchURL: string,
  type: string, body: string|null,
  options: FetchOptions
  ): Promise<any> {
  
  const msg: string = result?.msg ?? "Server Error";
  const status: number = response.status;
  const accessTokenKey = 'access_token';
  const refreshTokenKey = 'refresh_token';
  const userKey = 'user';  
    
  // Irrecoverable.
  const hardFailures: string[] = [
    "BlackListed", 
    "No Authorization", 
    "Not enough segments", 
    "Invalid token", 
    "Token revoked", 
    "Refresh token has been revoked", 
    "Missing Authorization Header", 
    "Token is not a refresh token",
  ];

  const refreshableFailure: string[] = [
    "Token has expired",
  ];

  if (hardFailures.includes(msg)) {
    cookies.remove(accessTokenKey);
    cookies.remove(refreshTokenKey);
    cookies.remove(userKey);
    //window.location.reload();
    return undefined;

  } else if (refreshableFailure.includes(msg) || status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    if (isRetry) {
      cookies.remove(accessTokenKey);
      cookies.remove(refreshTokenKey);
      cookies.remove(userKey);
      //window.location.reload();
      return undefined;
    }

    // Critical promise lock.
    const refreshResponse = await refreshAccessTokens();

    //if (refreshResponse === undefined){
    //  window.location.reload();
    //}

    return await genericResourceFetch(fetchURL, resource, component, type, body, {...options, isRetry: true});
  }
  return null;
}

/** @deprecated The website should not have to use this since backend will not work with it. */
export function createEventSource(
  fetchURL: string,
  onMessage: (message: any) => void
): any {
  const cookies = new Cookies();
  const accessToken = cookies.get('access_token');
  const refreshTokenValue = cookies.get('refresh_token');
  const user = cookies.get('user');

  if (accessToken && refreshTokenValue && user) {
    const url = createApiRequestUrl(fetchURL, cookies);

    const headers: Record<string, string> = {
      "Authorization": "Bearer " + accessToken
    };

    return eventsource.createEventSource({
      url,
      headers,
      onMessage,
    });
  }
}

export function parseRoleNames(roles: Role[]): Record<string, string> {
  const allRoles: Record<string, string> = {};

  for (let roleIndex = 0; roleIndex < roles.length; roleIndex++) {
    const role = roles[roleIndex];
    if (!role || !role.role_id) continue;
    allRoles[role.role_id] = role.role_name;
  }

  return allRoles;
}

export function parseRubricNames(rubrics: Rubric[]): Record<string, string> {
  const allRubrics: Record<string, string> = {};

  for (let rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
    const rubric = rubrics[rubricIndex];
    if (!rubric || !rubric.rubric_id) continue;
    allRubrics[rubric.rubric_id] = rubric.rubric_name;
  }

  return allRubrics;
}

export function parseCategoriesByRubrics(
  rubrics: Rubric[],
  categories: Category[]
): Record<string, Category[]> {
  const allCategoriesByRubrics: Record<string, Category[]> = {};

  for (let rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
    const rubric = rubrics[rubricIndex];
    if (rubric && rubric.rubric_id) {
      allCategoriesByRubrics[rubric.rubric_id] = [];
    }
  }

  Object.keys(allCategoriesByRubrics).forEach((rubricId) => {
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      const category = categories[categoryIndex];
      if (!category || category.rubric_id == null) continue;
      if (category.rubric_id === rubricId) {
        allCategoriesByRubrics[rubricId] = [
          ...(allCategoriesByRubrics[rubricId] || []),
          category
        ];
      }
    }
  });

  return allCategoriesByRubrics;
}

export function parseCategoriesToContained(categories: Category[]): Record<number, boolean> {
  const chosenCategories: Record<number, boolean> = {};

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    chosenCategories[categoryIndex] = false;
  }

  return chosenCategories;
}

export function parseUserNames(users: User[]): Record<string, string> {
  const allUserNames: Record<string, string> = {};

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    const user = users[userIndex];
    if (!user || !user.user_id) continue;
    const first = user.first_name ?? "";
    const last = user.last_name ?? "";
    allUserNames[user.user_id] = (first + " " + last).trim();
  }

  return allUserNames;
}

export function parseCourseRoles(courses: CourseRole[]): Record<string, string> {
  const allCourseRoles: Record<string, string> = {};

  for (let courseRoleIndex = 0; courseRoleIndex < courses.length; courseRoleIndex++) {
    const courseRole = courses[courseRoleIndex];
    if (!courseRole || !courseRole.course_id) continue;
    allCourseRoles[courseRole.course_id] = courseRole.role_id;
  }

  return allCourseRoles;
}

export function parseAssessmentIndividualOrTeam(
  assessmentTasks: AssessmentTask[]
): Record<string, string> {
  const allAssessments: Record<string, string> = {};

  for (let assessmentIndex = 0; assessmentIndex < assessmentTasks.length; assessmentIndex++) {
    const task = assessmentTasks[assessmentIndex];
    if (!task || !task.assessment_task_id) continue;
    allAssessments[task.assessment_task_id] = task.unit_of_assessment;
  }

  return allAssessments;
}

export function parseCategoryIDToCategories(
  categories: Category[]
): Record<string, Category> {
  const categoryIdsToCategories: Record<string, Category> = {};

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    const category = categories[categoryIndex];
    if (!category || !category.category_id) continue;
    categoryIdsToCategories[category.category_id] = category;
  }

  return categoryIdsToCategories;
}

export function validPassword(password: string): boolean | string {
  if (password.length < 8)
    return "be at least 8 characters long.";
  else if (!/[A-Z]/.test(password))
    return "contain at least one upper case letter.";
  else if (!/[a-z]/.test(password))
    return "contain at least one lower case letter.";
  else if (!/[0-9]/.test(password))
    return "have at least one digit.";
  
  return true;
}

export function getDueDateString(dueDate: Date): string {
  const year = dueDate.getFullYear();
  const month = dueDate.getMonth() + 1;
  const day = dueDate.getDate();
  const hours = dueDate.getHours();
  const minutes = dueDate.getMinutes();
  const seconds = dueDate.getSeconds();
  const milliseconds = dueDate.getMilliseconds();

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
}

export function getHumanReadableDueDate(dueDate: string | Date, timeZone?: string): string {
  const date = new Date(dueDate);
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const twelveHourClock = hour < 12 ? "am" : "pm";
  const displayHour = hour > 12 ? (hour % 12) : (hour === 0 ? 12 : hour);
  const minutesString = minute < 10 ? ("0" + minute) : String(minute);
  const timeString = `${displayHour}:${minutesString}${twelveHourClock}`;

  return `${monthNames[month]} ${day} at ${timeString} ${timeZone || ""}`.trim();
}

/**
 * Accepts a function and returns another function. Calling the returned function
 * will schedule func to be called after the wait time has elapsed, and calling it
 * again will reset wait time. This prevents func from being called more than once
 * per wait time.
 * 
 * @param func - The function to debounce.
 * @param wait - The wait time in milliseconds.
 * @returns The debounced function.
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

const modules = {
  genericResourceFetch
};

export function saveAdminCredentialsToSession(cookies: Cookies) {
    const adminCreds = {
        user: cookies.get('user'),
        access_token: cookies.get('access_token'),
        refresh_token: cookies.get('refresh_token')
    };
    sessionStorage.setItem('adminCredentials', JSON.stringify(adminCreds));
}

export function restoreAdminCredentialsFromSession() {
    const cookies = new Cookies();
    const stored = JSON.parse(sessionStorage.getItem('adminCredentials') || '{}');
    if (stored.user) cookies.set('user', stored.user, { path: '/' });
    if (stored.access_token) cookies.set('access_token', stored.access_token, { path: '/' });
    if (stored.refresh_token) cookies.set('refresh_token', stored.refresh_token, { path: '/' });
    sessionStorage.removeItem('adminCredentials');
    sessionStorage.removeItem('viewingAsStudent');
    window.location.reload();
}

export function setTestStudentCookies(data: any ) {
    const cookies = new Cookies();
    
    // Clear old cookies
    cookies.remove('access_token', { path: '/' });
    cookies.remove('refresh_token', { path: '/' });
    cookies.remove('user', { path: '/' });
    
    // Check if data has the expected structure
    if (!data.access_token || !data.user) {
        throw new Error('Invalid test student data');
    }
    
    // Set new cookies exactly like Login.js does
    cookies.set('access_token', data.access_token, {sameSite: 'strict'});
    cookies.set('refresh_token', data.refresh_token, {sameSite: 'strict'});
    
    const userWithFlag = {
        ...data.user,
        viewingAsStudent: true
    };
    cookies.set('user', userWithFlag, {sameSite: 'strict'});
}

export default modules;