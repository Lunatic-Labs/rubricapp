<<<<<<< HEAD
import { apiUrl } from './App.js';
// @ts-expect-error TS(2307): Cannot find module 'universal-cookie' or its corre... Remove this comment to see the full error message
import Cookies from 'universal-cookie';
// @ts-expect-error TS(2307): Cannot find module 'eventsource-client' or its cor... Remove this comment to see the full error message
import * as eventsource from "eventsource-client";

export async function genericResourceGET(fetchURL: any, resource: any, component: any, options = {}) {
    return await genericResourceFetch(fetchURL, resource, component, "GET", null, options);
}

export async function genericResourcePOST(fetchURL: any, component: any, body: any, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "POST", body, options);
}

export async function genericResourcePUT(fetchURL: any, component: any, body: any, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "PUT", body, options);
}

export async function genericResourceDELETE(fetchURL: any, component: any, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "DELETE", null, options)
}

function createApiRequestUrl(fetchURL: any, cookies: any) {
    return fetchURL.indexOf('?') > -1 ? apiUrl + fetchURL + `&user_id=${cookies.get('user')['user_id']}` : apiUrl + fetchURL + `?user_id=${cookies.get('user')['user_id']}`;
}

// @ts-expect-error TS(7023): 'genericResourceFetch' implicitly has return type ... Remove this comment to see the full error message
async function genericResourceFetch(fetchURL: any, resource: any, component: any, type: any, body: any, options = {}) {
    const {
        // @ts-expect-error TS(2339): Property 'dest' does not exist on type '{}'.
        dest = resource,
        // @ts-expect-error TS(2339): Property 'rawResponse' does not exist on type '{}'... Remove this comment to see the full error message
        rawResponse = false, // Return the raw response from the backend instead of just the resource
        // @ts-expect-error TS(2339): Property 'isRetry' does not exist on type '{}'.
        isRetry = false // Track if this is a retry after token refresh
    } = options;

    const cookies = new Cookies();

    if (cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
        let url = createApiRequestUrl(fetchURL, cookies);

        var headers = {
            "Authorization": "Bearer " + cookies.get('access_token')
        };

        if (url.indexOf('bulk_upload') === -1) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            headers["Content-Type"] = "application/json";
        }

        let response;

        try {
            response = await fetch(
                url,
                {
                    method: type,
                    headers: headers,
                    body: body
                }
            );
        } catch (error) {
            console.error(`=== UTILITY: ${type} ERROR ===`);
            console.error('Error:', error);
            
            component.setState({
                isLoaded: true,
                errorMessage: error,
            });

            throw error;
        }

        const result = await response.json();
        if (result['success']) {
            let state = {};

            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            state['isLoaded'] = true;

            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            state['errorMessage'] = null;

            if (resource) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                state[dest] = result['content'][resource][0];
            }

            component.setState(state);

            return rawResponse ? result : state;

        } else if (result['msg'] === "BlackListed" || result['msg'] === "No Authorization") {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');

            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
            window.location.reload(false);

            return undefined;

        } else if (
            result['msg'] === "Token has expired" ||
            result['msg'] === "Not enough segments" ||
            result['msg'] === "Invalid token" ||
            response.status === 422  // Catch all 422 errors as potential token issues
        ) {
            if (isRetry) {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                window.location.reload(false);
                return undefined;
            }


            const refreshToken = cookies.get('refresh_token');
            const userId = cookies.get('user')?.["user_id"];

            try {
                // Add &refresh_token=${refreshToken}
                const refreshResponse = await fetch(`${apiUrl}/refresh?user_id=${userId}&refresh_token=${refreshToken}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
                    }
                });

                const refreshResult = await refreshResponse.json();

                if (refreshResult["success"]) {
                    // Set new access token
                    cookies.set('access_token', refreshResult['headers']['access_token'], { sameSite: 'strict' });

                    // Set new refresh token
                    cookies.set('refresh_token', refreshResult['headers']['refresh_token'], { sameSite: 'strict' });


                    // Retry the original request with new token
                    return await genericResourceFetch(fetchURL, resource, component, type, body, {
                        ...options,
                        isRetry: true
                    });
                    
            } else {
                // Refresh failed - kick user out
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');
                // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
                window.location.reload(false);
                return undefined;
            }
        } catch (refreshError) {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');
            // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
            window.location.reload(false);
            return undefined;
        }

    } else {
        const state = {
            isLoaded: true,
            errorMessage: result['message'],
        };

        component.setState(state);

        return rawResponse ? result : state;
    }
}
}

export function createEventSource(fetchURL: any, onMessage: any) {
    const cookies = new Cookies();

    if (cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
        const url = createApiRequestUrl(fetchURL, cookies);

        const headers = {
            "Authorization": "Bearer " + cookies.get('access_token')
        };

        return eventsource.createEventSource({
            url,
            headers,
            onMessage,
        });
    }
}

export function parseRoleNames(roles: any) {
    var allRoles = {};

    for (var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allRoles[roles[roleIndex]["role_id"]] = roles[roleIndex]["role_name"];
    }

    return allRoles;
}

export function parseRubricNames(rubrics: any) {
    var allRubrics = {};

    for (var rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allRubrics[rubrics[rubricIndex]["rubric_id"]] = rubrics[rubricIndex]["rubric_name"];
    }

    return allRubrics;
}

export function parseCategoriesByRubrics(rubrics: any, categories: any) {
    var allCategoriesByRubrics = {};

    for (var rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allCategoriesByRubrics[rubrics[rubricIndex]["rubric_id"]] = [];
    }

    Object.keys(allCategoriesByRubrics).map((rubricId) => {
        for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
            if (categories[categoryIndex]["rubric_id"] === rubricId - "0") {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                allCategoriesByRubrics[rubricId] = [...allCategoriesByRubrics[rubricId], categories[categoryIndex]];
            }
        }

        return rubricId;
    });

    return allCategoriesByRubrics;
}

export function parseCategoriesToContained(categories: any) {
    var chosenCategories = {};

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        chosenCategories[categoryIndex] = false;
    }

    return chosenCategories;
}

export function parseUserNames(users: any) {
    var allUserNames = {};

    for (var userIndex = 0; userIndex < users.length; userIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allUserNames[users[userIndex]["user_id"]] = users[userIndex]["first_name"] + " " + users[userIndex]["last_name"];
    }

    return allUserNames;
}

export function parseCourseRoles(courses: any) {
    var allCourseRoles = {};

    for (var courseRoleIndex = 0; courseRoleIndex < courses.length; courseRoleIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allCourseRoles[courses[courseRoleIndex]["course_id"]] = courses[courseRoleIndex]["role_id"];
    }

    return allCourseRoles;
}

export function parseAssessmentIndividualOrTeam(assessmentTasks: any) {
    var allAssessments = {};

    for (var assessmentIndex = 0; assessmentIndex < assessmentTasks.length; assessmentIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        allAssessments[assessmentTasks[assessmentIndex]["assessment_task_id"]] = assessmentTasks[assessmentIndex]["unit_of_assessment"];
    }

    return allAssessments;
}

export function parseCategoryIDToCategories(categories: any) {
    var categoryIdsToCategories = {};

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        categoryIdsToCategories[categories[categoryIndex]["category_id"]] = categories[categoryIndex];
    }

    return categoryIdsToCategories;
}

export function validPasword(password: any) {
    if (password.length < 8)
        return "be at least 8 characters long.";
    else if (!/[A-Z]/.test(password))
        return "contain at least one upper case letter.";
    else if (!/[a-z]/.test(password))
        return "contain at least one lower case letter.";
    else if (!/[0-9]/.test(password))
        return "have at least one digit."
    return true;
}

export function getDueDateString(dueDate: any) {
    let year = dueDate.getFullYear();

    let month = dueDate.getMonth() + 1;

    let day = dueDate.getDate();

    let hours = dueDate.getHours();

    let minutes = dueDate.getMinutes();

    let seconds = dueDate.getSeconds();

    let milliseconds = dueDate.getMilliseconds();

    let dueDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return dueDateString;
}

export function getHumanReadableDueDate(dueDate: any, timeZone: any) {
    const date = new Date(dueDate);

    const month = date.getMonth();

    const day = date.getDate();

    const hour = date.getHours();

    const minute = date.getMinutes();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const twelveHourClock = hour < 12 ? "am" : "pm";

    const displayHour = hour > 12 ? (hour % 12) : (hour === 0 ? 12 : hour);

    const minutesString = minute < 10 ? ("0" + minute) : minute;

    const timeString = `${displayHour}:${minutesString}${twelveHourClock}`;

    return `${monthNames[month]} ${day} at ${timeString} ${timeZone ? timeZone : ""}`;
}

/**
 * Accepts a function and returns another function. Calling the returned function
 * will schedule func to be called after the wait time has elasped, and calling it
 * again will reset wait time. This prevents func from being called more than once
 * per wait time.
 * 
 * @param {function(...): void} func - The function.
 * @param {number} wait - The wait time in milliseconds.
 * @returns {function(...): void} The debounced function.
 */
export function debounce(func: any, wait: any) {
    let timeoutId: any = null;

    return (...args: any[]) => {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            func(...args);
        }, wait);
    };
}

const modules = {
    genericResourceFetch
=======
import { apiUrl } from './App';
import Cookies from 'universal-cookie';
import * as eventsource from "eventsource-client";

interface FetchOptions {
  dest?: string;
  rawResponse?: boolean;
  isRetry?: boolean;
}

interface ApiResponse {
  success: boolean;
  msg?: string;
  message?: string;
  content?: Record<string, any>;
  headers?: {
    access_token: string;
    refresh_token: string;
  };
}

interface EventSourceOptions {
  url: string;
  headers: Record<string, string>;
  onMessage: (message: any) => void;
}

interface RoleMap {
  [key: string]: string;
}

interface RubricMap {
  [key: string]: string;
}

interface UserNameMap {
  [key: string]: string;
}

interface CourseRoleMap {
  [key: string]: string;
}

interface AssessmentMap {
  [key: string]: string;
}

interface CategoryMap {
  [key: string]: any;
}

export async function genericResourceGET(
  fetchURL: string,
  resource: string,
  component: any,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, resource, component, "GET", null, options);
}

export async function genericResourcePOST(
  fetchURL: string,
  component: any,
  body: string,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "POST", body, options);
}

export async function genericResourcePUT(
  fetchURL: string,
  component: any,
  body: string,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "PUT", body, options);
}

export async function genericResourceDELETE(
  fetchURL: string,
  component: any,
  options: FetchOptions = {}
): Promise<any> {
  return await genericResourceFetch(fetchURL, null, component, "DELETE", null, options);
}

function createApiRequestUrl(fetchURL: string, cookies: Cookies): string {
  const userId = cookies.get('user')?.['user_id' as any];
  return fetchURL.indexOf('?') > -1
    ? apiUrl + fetchURL + `&user_id=${userId}`
    : apiUrl + fetchURL + `?user_id=${userId}`;
}

async function genericResourceFetch(
  fetchURL: string,
  resource: string | null,
  component: any,
  type: "GET" | "POST" | "PUT" | "DELETE",
  body: string | null,
  options: FetchOptions = {}
): Promise<any> {
  const {
    dest = resource,
    rawResponse = false,
    isRetry = false,
  } = options;

  const cookies = new Cookies();

  if (cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
    let url = createApiRequestUrl(fetchURL, cookies);

    const headers: Record<string, string> = {
      "Authorization": "Bearer " + cookies.get('access_token'),
    };

    if (url.indexOf('bulk_upload') === -1) {
      headers["Content-Type"] = "application/json";
    }

    let response: Response;

    try {
      response = await fetch(url, {
        method: type,
        headers: headers,
        body: body,
      });
    } catch (error) {
      component.setState({
        isLoaded: true,
        errorMessage: error,
      });

      throw error;
    }

    const result: ApiResponse = await response.json();

    if (result.success) {
      const state: Record<string, any> = {
        isLoaded: true,
        errorMessage: null,
      };

      if (resource && dest) {
        state[dest as any] = result.content?.[resource]?.[0];
      }

      component.setState(state);

      return rawResponse ? result : state;
    } else if (result.msg === "BlackListed" || result.msg === "No Authorization") {
      cookies.remove('access_token');
      cookies.remove('refresh_token');
      cookies.remove('user');

      window.location.reload();

      return undefined;
    } else if (
      result.msg === "Token has expired" ||
      result.msg === "Not enough segments" ||
      result.msg === "Invalid token" ||
      response.status === 422
    ) {
      if (isRetry) {
        cookies.remove('access_token');
        cookies.remove('refresh_token');
        cookies.remove('user');
        window.location.reload();
        return undefined;
      }

      const refreshToken = cookies.get('refresh_token');
      const userId = cookies.get('user')?.["user_id" as any];

      try {
        const refreshResponse = await fetch(
          `${apiUrl}/refresh?user_id=${userId}&refresh_token=${refreshToken}`,
          {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + refreshToken,
            },
          }
        );

        const refreshResult: ApiResponse = await refreshResponse.json();

        if (refreshResult.success && refreshResult.headers) {
          cookies.set('access_token', refreshResult.headers.access_token, { sameSite: 'strict' } as any);
          cookies.set('refresh_token', refreshResult.headers.refresh_token, { sameSite: 'strict' } as any);

          return await genericResourceFetch(fetchURL, resource, component, type, body, {
            ...options,
            isRetry: true,
          });
        } else {
          cookies.remove('access_token');
          cookies.remove('refresh_token');
          cookies.remove('user');
          window.location.reload();
          return undefined;
        }
      } catch (refreshError) {
        cookies.remove('access_token');
        cookies.remove('refresh_token');
        cookies.remove('user');
        window.location.reload();
        return undefined;
      }
    } else {
      const state = {
        isLoaded: true,
        errorMessage: result.message,
      };

      component.setState(state);

      return rawResponse ? result : state;
    }
  } else {
    const state = {
      isLoaded: true,
      errorMessage: "No authentication found",
    };

    component.setState(state);

    return state;
  }
}

export function createEventSource(
  fetchURL: string,
  onMessage: (message: any) => void
): any {
  const cookies = new Cookies();

  if (cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
    const url = createApiRequestUrl(fetchURL, cookies);

    const headers: Record<string, string> = {
      "Authorization": "Bearer " + cookies.get('access_token'),
    };

    return eventsource.createEventSource({
      url,
      headers,
      onMessage,
    });
  }
}

export function parseRoleNames(roles: any[]): RoleMap {
  const allRoles: RoleMap = {};

  for (let roleIndex = 0; roleIndex < roles.length; roleIndex++) {
    allRoles[roles[roleIndex]["role_id"]] = roles[roleIndex]["role_name"];
  }

  return allRoles;
}

export function parseRubricNames(rubrics: any[]): RubricMap {
  const allRubrics: RubricMap = {};

  for (let rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
    allRubrics[rubrics[rubricIndex]["rubric_id"]] = rubrics[rubricIndex]["rubric_name"];
  }

  return allRubrics;
}

export function parseCategoriesByRubrics(
  rubrics: any[],
  categories: any[]
): Record<string, any[]> {
  const allCategoriesByRubrics: Record<string, any[]> = {};

  for (let rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
    allCategoriesByRubrics[rubrics[rubricIndex]["rubric_id"]] = [];
  }

  Object.keys(allCategoriesByRubrics).map((rubricId) => {
    for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      if (categories[categoryIndex]["rubric_id"] === parseInt(rubricId)) {
        allCategoriesByRubrics[rubricId] = [
          ...allCategoriesByRubrics[rubricId],
          categories[categoryIndex],
        ];
      }
    }

    return rubricId;
  });

  return allCategoriesByRubrics;
}

export function parseCategoriesToContained(categories: any[]): Record<number, boolean> {
  const chosenCategories: Record<number, boolean> = {};

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    chosenCategories[categoryIndex] = false;
  }

  return chosenCategories;
}

export function parseUserNames(users: any[]): UserNameMap {
  const allUserNames: UserNameMap = {};

  for (let userIndex = 0; userIndex < users.length; userIndex++) {
    allUserNames[users[userIndex]["user_id"]] =
      users[userIndex]["first_name"] + " " + users[userIndex]["last_name"];
  }

  return allUserNames;
}

export function parseCourseRoles(courses: any[]): CourseRoleMap {
  const allCourseRoles: CourseRoleMap = {};

  for (let courseRoleIndex = 0; courseRoleIndex < courses.length; courseRoleIndex++) {
    allCourseRoles[courses[courseRoleIndex]["course_id"]] = courses[courseRoleIndex]["role_id"];
  }

  return allCourseRoles;
}

export function parseAssessmentIndividualOrTeam(assessmentTasks: any[]): AssessmentMap {
  const allAssessments: AssessmentMap = {};

  for (let assessmentIndex = 0; assessmentIndex < assessmentTasks.length; assessmentIndex++) {
    allAssessments[assessmentTasks[assessmentIndex]["assessment_task_id"]] =
      assessmentTasks[assessmentIndex]["unit_of_assessment"];
  }

  return allAssessments;
}

export function parseCategoryIDToCategories(categories: any[]): CategoryMap {
  const categoryIdsToCategories: CategoryMap = {};

  for (let categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
    categoryIdsToCategories[categories[categoryIndex]["category_id"]] = categories[categoryIndex];
  }

  return categoryIdsToCategories;
}

export function validPassword(password: string): string | boolean {
  if (password.length < 8) return "be at least 8 characters long.";
  else if (!/[A-Z]/.test(password)) return "contain at least one upper case letter.";
  else if (!/[a-z]/.test(password)) return "contain at least one lower case letter.";
  else if (!/[0-9]/.test(password)) return "have at least one digit.";
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

export function getHumanReadableDueDate(dueDate: string, timeZone?: string): string {
  const date = new Date(dueDate);
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const twelveHourClock = hour < 12 ? "am" : "pm";
  const displayHour = hour > 12 ? hour % 12 : hour === 0 ? 12 : hour;
  const minutesString = minute < 10 ? "0" + minute : minute;

  const timeString = `${displayHour}:${minutesString}${twelveHourClock}`;

  return `${monthNames[month]} ${day} at ${timeString} ${timeZone ? timeZone : ""}`;
}

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
  genericResourceFetch,
>>>>>>> 5b40833d7f48a101e02bae62763a138e667e940b
};

export default modules;