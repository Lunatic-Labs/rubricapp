import { apiUrl } from './App.js';
import Cookies from 'universal-cookie';
import * as eventsource from "eventsource-client";

export async function genericResourceGET(fetchURL, resource, component, options = {}) {
    return await genericResourceFetch(fetchURL, resource, component, "GET", null, options);
}

export async function genericResourcePOST(fetchURL, component, body, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "POST", body, options);
}

export async function genericResourcePUT(fetchURL, component, body, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "PUT", body, options);
}

export async function genericResourceDELETE(fetchURL, component, options = {}) {
    return await genericResourceFetch(fetchURL, null, component, "DELETE", null, options)
}

function createApiRequestUrl(fetchURL, cookies) {
    return fetchURL.indexOf('?') > -1 ? apiUrl + fetchURL + `&user_id=${cookies.get('user')['user_id']}` : apiUrl + fetchURL + `?user_id=${cookies.get('user')['user_id']}`;
}

async function genericResourceFetch(fetchURL, resource, component, type, body, options = {}) {
    const {
        dest = resource,
        rawResponse = false, // Return the raw response from the backend instead of just the resource
        isRetry = false // Track if this is a retry after token refresh
    } = options;

    const cookies = new Cookies();

    if (cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
        let url = createApiRequestUrl(fetchURL, cookies);

        var headers = {
            "Authorization": "Bearer " + cookies.get('access_token')
        };

        if (url.indexOf('bulk_upload') === -1) {
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
            component.setState({
                isLoaded: true,
                errorMessage: error,
            });

            throw error;
        }


        const result = await response.json();
        if (result['success']) {
            let state = {};

            state['isLoaded'] = true;

            state['errorMessage'] = null;

            if (resource) {
                state[dest] = result['content'][resource][0];
            }

            component.setState(state);

            return rawResponse ? result : state;

        } else if (result['msg'] === "BlackListed" || result['msg'] === "No Authorization") {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');

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
                window.location.reload(false);
                return undefined;
            }
        } catch (refreshError) {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');
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

export function createEventSource(fetchURL, onMessage) {
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

export function parseRoleNames(roles) {
    var allRoles = {};

    for (var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
        allRoles[roles[roleIndex]["role_id"]] = roles[roleIndex]["role_name"];
    }

    return allRoles;
}

export function parseRubricNames(rubrics) {
    var allRubrics = {};

    for (var rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
        allRubrics[rubrics[rubricIndex]["rubric_id"]] = rubrics[rubricIndex]["rubric_name"];
    }

    return allRubrics;
}

export function parseCategoriesByRubrics(rubrics, categories) {
    var allCategoriesByRubrics = {};

    for (var rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
        allCategoriesByRubrics[rubrics[rubricIndex]["rubric_id"]] = [];
    }

    Object.keys(allCategoriesByRubrics).map((rubricId) => {
        for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
            if (categories[categoryIndex]["rubric_id"] === rubricId - "0") {
                allCategoriesByRubrics[rubricId] = [...allCategoriesByRubrics[rubricId], categories[categoryIndex]];
            }
        }

        return rubricId;
    });

    return allCategoriesByRubrics;
}

export function parseCategoriesToContained(categories) {
    var chosenCategories = {};

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        chosenCategories[categoryIndex] = false;
    }

    return chosenCategories;
}

export function parseUserNames(users) {
    var allUserNames = {};

    for (var userIndex = 0; userIndex < users.length; userIndex++) {
        allUserNames[users[userIndex]["user_id"]] = users[userIndex]["first_name"] + " " + users[userIndex]["last_name"];
    }

    return allUserNames;
}

export function parseCourseRoles(courses) {
    var allCourseRoles = {};

    for (var courseRoleIndex = 0; courseRoleIndex < courses.length; courseRoleIndex++) {
        allCourseRoles[courses[courseRoleIndex]["course_id"]] = courses[courseRoleIndex]["role_id"];
    }

    return allCourseRoles;
}

export function parseAssessmentIndividualOrTeam(assessmentTasks) {
    var allAssessments = {};

    for (var assessmentIndex = 0; assessmentIndex < assessmentTasks.length; assessmentIndex++) {
        allAssessments[assessmentTasks[assessmentIndex]["assessment_task_id"]] = assessmentTasks[assessmentIndex]["unit_of_assessment"];
    }

    return allAssessments;
}

export function parseCategoryIDToCategories(categories) {
    var categoryIdsToCategories = {};

    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
        categoryIdsToCategories[categories[categoryIndex]["category_id"]] = categories[categoryIndex];
    }

    return categoryIdsToCategories;
}

export function validPasword(password) {
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

export function getDueDateString(dueDate) {
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

export function getHumanReadableDueDate(dueDate, timeZone) {
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
export function debounce(func, wait) {
    let timeoutId = null;

    return (...args) => {
        window.clearTimeout(timeoutId);

        timeoutId = window.setTimeout(() => {
            func(...args);
        }, wait);
    };
}

const modules = {
    genericResourceFetch
};

export default modules;