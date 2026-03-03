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
  message?: string;
  msg?: string;//Yes both versions can be sent back from the backend
  headers?: Record<string, string>;
  errorMessage?: string;
}


export interface User {
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


/**
 * Removes all auth data stored in the cookies.
 */
function removeAuthData() {
  const cookies: Cookies = new Cookies();
  const authDataToRemove = [
    'access_token',
    'refresh_token',
    'user',
  ]
 
  for (const key of authDataToRemove){
    cookies.remove(key);
  }
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
                                                                                        response, isRetry, fetchURL,
                                                                                        type, body, options);
     
    if (tokenErrorResult === null) {
      const parse = (msg:string) => {return msg.includes(':') ? msg.split(':').slice(1).join(':').trim() : msg}
      const state = {
        isLoaded: true,
        errorMessage: parse(result?.message ?? "Server error"),
      }
      component.setState(state);
      return rawResponse ? result : state;
    }
    return tokenErrorResult;
  }
}


/**
 * The function figures out we can retry a request that errored out from a token problem. If it is a hard
 * failure, the function will remove the tokens when needed and reaload the window to login view. Note that
 * upon reciving a request that already failed once due to token errors the window will reload.


/* Documentation:  These api calls can be found in the utility.js in the frontend dir

genericResourceGET

genericResourceGET(fetchURL, resource, component)
-Description:

genericResourceGET is an asynchronous function that uses HTTP GET to retrieve resources from a specified API endpoint. The function is called after a predetermined delay (timeToWait) and is designed to update the given component with the fetched data.
-Parameters:
fetchURL: (String) The API endpoint URL for retrieving data. This string can include query parameters.
resource: (String) A key or identifier for the resource being fetched. It often represents what type of data is expected from the API.
component: (Object) The component (e.g., a class or object) that will be updated with the fetched resource. The fetched data is typically stored or rendered within this component.
-Example Usage:
if (assessmentTask && !addAssessmentTask) {
           genericResourceGET(
           `/completed_assessment?assessment_task_id=${assessmentTask["assessment_task_id"]}`,"completedAssessments", this);


           
Explanation:
Conditional check: Before invoking genericResourceGET, there’s a condition if (assessmentTask && !addAssessmentTask) to ensure that the assessmentTask exists and that the addAssessmentTask process is not active.
fetchURL: The API endpoint is /completed_assessment, and it includes a query parameter assessment_task_id, which is dynamically populated using the assessmentTask["assessment_task_id"] value. This likely pulls data about completed assessments based on the task ID.
resource: The string "completedAssessments" is passed as the second parameter. This is probably used to reference or categorize the fetched data within the component.
component: The third parameter, this, refers to the current component (or class instance), where the result of the API call will be processed and stored.
Data Update: Once the data is retrieved, it is typically stored in the component, and "completedAssessments" serves as a key to identify where in the component the fetched data is placed.
-Notes:
Dynamic URLs: The fetchURL can include dynamic query parameters, like ${assessmentTask["assessment_task_id"]}, allowing the function to retrieve specific data for different tasks or objects.
Component Update: The component parameter (likely this) allows the function to update the state or properties of the calling object (such as a React component or a class).
timeToWait: Ensure the timeToWait variable is defined and reasonable, as it controls when the request is actually sent.

genericResourcePOST
genericResourcePOST(fetchURL, component, body) 
-Description:

genericResourcePOST is an asynchronous function that sends data to a specified API endpoint using the HTTP POST method. The function initiates the request after a delay (timeToWait), which is defined elsewhere in the code. It sends the data (body) to the fetchURL and then updates the specified component based on the server’s response.
-Parameters:
fetchURL: (String) The API endpoint URL for retrieving data. This string can include query parameters.
resource: (String) A key or identifier for the resource being fetched. It often represents what type of data is expected from the API.
component: (Object) The component (e.g., a class or object) that will be updated with the fetched resource. The fetched data is typically stored or rendered within this component.
Response Handling: The result of the POST request will typically be handled in the component. This could involve updating the state or showing confirmation messages to the user.

-Example Usage:
if (team === null && addTeam === null) {
      genericResourcePOST(`/team?course_id=${chosenCourse.course_id}`, this, body);

Explanation:
Conditional check: Before invoking genericResourceGET, there’s a condition if (assessmentTask && !addAssessmentTask) to ensure that the assessmentTask exists and that the addAssessmentTask process is not active.
fetchURL: The API endpoint is /completed_assessment, and it includes a query parameter assessment_task_id, which is dynamically populated using the assessmentTask["assessment_task_id"] value. This likely pulls data about completed assessments based on the task ID.
resource: The string "completedAssessments" is passed as the second parameter. This is probably used to reference or categorize the fetched data within the component.
component: The third parameter, this, refers to the current component (or class instance), where the result of the API call will be processed and stored.
-Notes:
Dynamic URLs: The fetchURL can include dynamic query parameters, like ${assessmentTask["assessment_task_id"]}, allowing the function to retrieve specific data for different tasks or objects.
Component Update: The component parameter (likely this) allows the function to update the state or properties of the calling object (such as a React component or a class).
timeToWait: Ensure the timeToWait variable is defined and reasonable, as it controls when the request is actually sent.


genericResourcePUT
genericResourcePUT(fetchURL, component, body) {
-Description:

genericResourcePUT is an asynchronous function used to send data to a specified API endpoint using the HTTP PUT method.
-Parameters:
fetchURL: (String) The URL of the API endpoint where the PUT request will be sent. This URL may include query parameters to specify the resource being updated.
component: (Object) The component (usually this) that will handle the response of the PUT request, often updating its internal state or performing actions based on the server’s response.
body: (Object or String) The data sent with the PUT request. This data is usually the updated information of the resource being modified.
Response Handling: The component is responsible for processing the response from the server. This could involve updating the state or displaying messages based on whether the update was successful or failed.
-Example Usage:
} else if (team !== null && addTeam === false) {
               genericResourcePUT(`/team?team_id=${team.team_id}`, this, body);
           }
Explanation:
Conditional Check: This checks whether team is not null (meaning a team exists) and whether addTeam is false (indicating no new team is being added but an existing team is being updated).
fetchURL: The API endpoint /team is used, with the query parameter team_id dynamically populated from team.team_id. This means the existing team identified by the team_id is being updated.
component: The this keyword refers to the current component where the response will be processed after the PUT request.
body: The body contains the updated information for the team, such as new details or modified fields.
-Notes:
PUT vs. POST: Unlike POST requests (which typically create new resources), PUT requests are used to update existing resources. In this case, it is used to update an existing team with new data.
Query Parameters: The fetchURL can include query parameters, like team_id, to specify which resource should be updated.
Response Handling: The component will handle the response from the PUT request. This might include updating the component’s internal state to reflect the changes, or showing feedback to the user (e.g., "Team updated successfully").


genericResourceFETCH
genericResourceFetch(fetchURL, resource, component, type, body) {
-Description:
genericResourceFetch is an asynchronous function that handles API requests of various types (GET, POST, PUT, etc.), adding authorization headers, handling JSON data, and managing the state of the calling component based on the server's response. It also deals with token expiration and user session management.
-Parameters:
fetchURL: (String) The API endpoint where the request will be sent. This URL can include query parameters and will be augmented with a user_id extracted from the cookies.
resource: (String, optional) A key used to determine which resource from the server response should be extracted and set in the component’s state. If not null, the resource determines how the response data is processed.
component: (Object) The component (typically this) that will be updated with the server's response. This component’s state will be set based on the result of the request.
type: (String) The HTTP method to be used for the request (GET, POST, PUT, etc.).
body: (Object or String, optional) The data sent in the request body. This is only required for methods like POST or PUT.
-Notes:
It is not used anywhere else except for GET, POST, PUT.
parseRoleNames
parseRoleNames(roles) {
-Description:
parseRoleNames is a utility function that takes an array of role objects and returns an object where each role's role_id is mapped to its role_name. This provides a convenient way to access role names using role IDs as keys.
-Parameters:
roles: (Array) An array of objects, where each object represents a role and contains the properties role_id and role_name.
-Return Value:
(Object): The function returns an object where the keys are the role_id values and the corresponding values are the role_name values from the roles array.
-Behavior:
The function initializes an empty object allRoles to store the mappings.
It then iterates through the roles array using a for loop.
For each role in the array, it adds a new property to the allRoles object, where the key is the role’s role_id and the value is the role’s role_name.
Finally, the function returns the allRoles object, which now contains all the role ID to role name mappings.

parseRubricNames
parseRubricNames(rubrics) {
-Description:
parseRubricNames is a utility function that processes an array of rubric objects and returns an object where each rubric's rubric_id is mapped to its respective rubric_name. This is useful for quick lookups of rubric names by their IDs.
-Parameters:
rubrics: (Array) An array of objects, where each object represents a rubric and contains the properties rubric_id and rubric_name.
-Return Value:
(Object): The function returns an object where the keys are rubric_id values, and the corresponding values are the rubric_name values from the rubrics array.
-Behavior:
The function initializes an empty object allRubrics to store the mappings.
It iterates through the rubrics array using a for loop.
For each rubric in the array, it adds a new key-value pair to the allRubrics object, where the key is the rubric_id and the value is the rubric_name.
Finally, the function returns the allRubrics object, which contains all the rubric ID-to-name mappings.

parseCategoriesByRubrics
parseCategoriesByRubrics(rubrics, categories) {


parseCategoriesToContained
parseCategoriesToContained(categories) {
-Description:
parseCategoriesToContained is a utility function that creates an object where each key represents a category index (from the categories array) and the corresponding value is set to false. This is useful for tracking the state of categories, such as whether a category is selected or active.
-Parameters:
categories: (Array) An array of category objects. Each category represents some data or functionality that you may want to track.
-Return Value:
(Object): The function returns an object where each key is the index of a category in the categories array, and each value is false, representing an unselected or inactive state.
-Behavior:
The function initializes an empty object chosenCategories.
It iterates through the categories array using a for loop.
For each category, it creates a key in chosenCategories where the key is the index of the category in the array, and the value is set to false.
After the loop finishes, the function returns the chosenCategories object.

parseUserNames
parseUserNames(users) {
-Description:
parseUserNames is a utility function that processes an array of user objects and returns an object where each user_id is mapped to the user's full name (a concatenation of their first_name and last_name). This provides a convenient way to access user names by their IDs.
-Parameters:
users: (Array) An array of user objects, where each object contains user_id, first_name, and last_name properties.
-Return Value:
(Object): The function returns an object where each key is a user_id from the users array, and each corresponding value is the user's full name (i.e., first_name + last_name).
-Behavior:
Initialization: The function initializes an empty object allUserNames to store the mappings.
Iteration: It loops through the users array using a for loop.
Mapping: For each user, it creates a key in the allUserNames object where the key is the user's user_id and the value is a string that concatenates first_name and last_name, separated by a space.
Return: After iterating through all the users, the function returns the allUserNames object.
parseCourseRoles
parseCourseRoles(courses) {
-Description:
parseCourseRoles is a utility function that processes an array of course objects and returns an object where each course_id is mapped to its associated role_id. This is useful for quickly looking up the role a user has in each course.
-Parameters:
courses: (Array) An array of course objects, where each object contains course_id and role_id properties. These represent the course and the user's role in that course, respectively.
-Return Value:
(Object): The function returns an object where each key is a course_id from the courses array, and each corresponding value is the role_id associated with that course.
-Behavior:
Initialization: The function initializes an empty object allCourseRoles to store the mappings of course_id to role_id.
Iteration: It loops through the courses array using a for loop.
Mapping: For each course, it creates a key in the allCourseRoles object where the key is the course_id and the value is the role_id.
Return: After processing all the courses, the function returns the allCourseRoles object.
parseAssessmentIndividualOrTeam
parseAssessmentIndividualOrTeam(assessmentTasks) {
-Description:
parseAssessmentIndividualOrTeam is a utility function that processes an array of assessment task objects and returns an object where each assessment_task_id is mapped to its corresponding unit_of_assessment value. The unit_of_assessment typically indicates whether the assessment is conducted on an individual or team basis.
-Parameters:
assessmentTasks: (Array) An array of assessment task objects. Each object should contain assessment_task_id and unit_of_assessment properties.
-Return Value:
(Object): The function returns an object where each key is an assessment_task_id, and the corresponding value is the unit_of_assessment (either "individual" or "team").
-Behavior:
Initialization: The function initializes an empty object allAssessments to store the mapping of assessment_task_id to unit_of_assessment.
Iteration: It loops through the assessmentTasks array using a for loop.
Mapping: For each assessment task, it creates a key in the allAssessments object where the key is the assessment_task_id and the value is the unit_of_assessment.
Return: After processing all assessment tasks, the function returns the allAssessments object.

parseCategoryIDToCategories
parseCategoryIDToCategories(categories) {
-Description:
parseCategoryIDToCategories is a utility function that processes an array of category objects and returns an object where each category_id is mapped to its corresponding category object. This function provides a quick way to retrieve a full category object using its category_id.
-Parameters:
categories: (Array) An array of category objects. Each object should contain a category_id along with other category-related properties.
-Return Value:
(Object): The function returns an object where each key is a category_id, and the corresponding value is the complete category object.
-Behavior:
Initialization: The function initializes an empty object categoryIdsToCategories to store the mappings.
Iteration: It loops through the categories array using a for loop.
Mapping: For each category in the array, it creates a key in the categoryIdsToCategories object where the key is the category_id and the value is the full category object.
Return: After processing all categories, the function returns the categoryIdsToCategories object.
validPassword
validPasword(password) {
-Description:
validPassword is a utility function that validates a password string based on the following criteria:
The password must be at least 8 characters long.
It must contain at least one uppercase letter.
It must contain at least one lowercase letter.
It must contain at least one digit.
If the password meets all these criteria, the function returns true. Otherwise, it returns a string describing which validation rule the password fails to meet.
-Notes:
I couldn’t find any reference to this api call.
formatDueDate
formatDueDate(dueDate, timeZone) {
-Description:
formatDueDate is a utility function that converts and formats a given dueDate to a specific time zone. It uses a predefined mapping of common time zones (EST, CST, MST, PST, and UTC) and formats the date in the UTC ISO 8601 format (yyyy-MM-dd'T'HH:mm:ss.SSS'Z').
-Parameters:
dueDate: (String or Date) The date that needs to be formatted. This can be a JavaScript Date object or a date string.
timeZone: (String) The time zone abbreviation for which the dueDate should be formatted. Supported time zones are:
EST: Eastern Standard Time
CST: Central Standard Time
MST: Mountain Standard Time
PST: Pacific Standard Time
UTC: Coordinated Universal Time
-Return Value:
(String): The function returns the dueDate formatted as an ISO 8601 UTC string (yyyy-MM-dd'T'HH:mm:ss.SSS'Z'), adjusted to the specified time zone.
-Time Zone Mapping:
The function maps time zone abbreviations to their corresponding IANA time zone identifiers:
EST: America/New_York
CST: America/Chicago
MST: America/Denver
PST: America/Los_Angeles
UTC: UTC (no time zone offset)
-Behavior:
Time Zone Mapping: The function first maps the provided timeZone abbreviation to its corresponding IANA time zone ID using the timeZoneMap.
Convert to UTC: It converts the dueDate from the specified time zone to UTC using the zonedTimeToUtc function.
Format the Date: It formats the dueDate into the ISO 8601 UTC string format (yyyy-MM-dd'T'HH:mm:ss.SSS'Z'), using the format function.
Return: The function returns the formatted date string.

getDueDateString
getDueDateString(dueDate) {
-Description:
getDueDateString is a utility function that converts a JavaScript Date object into a string formatted as yyyy-MM-ddTHH:mm:ss.SSSZ (ISO 8601 format). This format represents a date and time with precision up to milliseconds in the UTC time zone.
-Parameters:
dueDate: (Date) A JavaScript Date object representing the date and time that needs to be formatted.
-Return Value:
(String): The function returns a formatted date string in the ISO 8601 format: yyyy-MM-ddTHH:mm:ss.SSSZ.
-Behavior:
Extract Date Components: The function extracts individual components from the dueDate:
year: The full year (yyyy).
month: The month (MM), adjusted by adding 1 because JavaScript months are zero-indexed.
day: The day of the week (from 0 to 6), which is incorrect as it should be the day of the month.
hours: The hour (HH).
minutes: The minutes (mm).
seconds: The seconds (ss).
milliseconds: The milliseconds (SSS).
Build the String: The function builds the formatted string in the yyyy-MM-ddTHH:mm:ss.SSSZ format.
Return: The function returns the final formatted string.


getHumanReadableDueDate
getHumanReadableDueDate(dueDate, timeZone) {
-Description:
getHumanReadableDueDate is a utility function that formats a given dueDate string into a human-readable format.

 */


/**
 * Accepts a function and returns another function. Calling the returned function
 * will schedule func to be called after the wait time has elasped, and calling it
 * again will reset wait time. This prevents func from being called more than once
 * per wait time.
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
  response: Response, isRetry: boolean,
  fetchURL: string, type: string,
  body: string|null, options: FetchOptions
  ): Promise<any> {
 
  const msg: string = result?.msg ?? "Server Error";
  const status: number = response.status;
   
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
    removeAuthData();
    window.location.reload();
    return undefined;


  } else if (refreshableFailure.includes(msg) || status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    if (isRetry) {
      removeAuthData();
      window.location.reload();
      return undefined;
    }


    // Critical promise lock.
    const refreshResponse = await refreshAccessTokens();


    if (refreshResponse === undefined){
      removeAuthData();
      window.location.reload();
      return undefined;
    }


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




