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
};

export default modules;