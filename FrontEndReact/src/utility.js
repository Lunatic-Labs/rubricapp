import { apiUrl } from './App.js'; 
import Cookies from 'universal-cookie';
import { zonedTimeToUtc, format } from "date-fns-tz";



var timeToWait = 500;

export function genericResourceGET(fetchURL, resource, component) {
    setTimeout(() => {
        genericResourceFetch(fetchURL, resource, component, "GET", null);
    }, timeToWait);
}

export function genericResourcePOST(fetchURL, component, body) {
    setTimeout(() => {
        genericResourceFetch(fetchURL, null, component, "POST", body);
    }, timeToWait);
}

export function genericResourcePUT(fetchURL, component, body) {
    setTimeout(() => {
        genericResourceFetch(fetchURL, null, component, "PUT", body);
    }, timeToWait);
}

async function genericResourceFetch(fetchURL, resource, component, type, body) {
    const cookies = new Cookies();

    if(cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user')) {
        let url = fetchURL.indexOf('?') > -1 ? apiUrl + fetchURL + `&user_id=${cookies.get('user')['user_id']}` : apiUrl + fetchURL + `?user_id=${cookies.get('user')['user_id']}`;

        var headers = {
            "Authorization": "Bearer " + cookies.get('access_token')
        };

        if(url.indexOf('bulk_upload') === -1) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(
            url,
            {
                method: type,
                headers: headers,
                body: body
            }
        ).catch(
            (error) => {
                component.setState({
                    isLoaded: true,
                    errorMessage: error,
                });
            }
        )

        const result = await response.json();
   
        if(result['success']) {
            let state = {};

            state['isLoaded'] = true;

            state['errorMessage'] = null;

            if(resource != null) {
            console.log("result: ", result);                
                var getResource = resource;

                getResource = (getResource === "assessmentTasks") ? "assessment_tasks": getResource;

                getResource = (getResource === "completedAssessments") ? "completed_assessments": getResource;

                getResource = (getResource === "csvCreation") ? "csv_creation": getResource;

                getResource = (getResource === "teamMembers") ? "team_members": getResource;

                getResource = (getResource === "indiv_users") ? "users": getResource;

                state[resource] = result['content'][getResource][0];
            }

            component.setState(state);

        } else if(result['msg']==="BlackListed" || result['msg']==="No Authorization") {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user');

            window.location.reload(false);

        } else if (result['msg']==="Token has expired") {
            cookies.remove('access_token');

            window.location.reload(false);

        } else {
            component.setState({
                isLoaded: true,
                errorMessage: result['message'],
            });
        }
    }
}

export function parseRoleNames(roles) {
    var allRoles = {};

    for(var roleIndex = 0; roleIndex < roles.length; roleIndex++) {
        allRoles[roles[roleIndex]["role_id"]] = roles[roleIndex]["role_name"];
    }

    return allRoles;
}

export function parseRubricNames(rubrics) {
    var allRubrics = {};

    for(var rubricIndex = 0; rubricIndex < rubrics.length; rubricIndex++) {
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
            if (categories[categoryIndex]["rubric_id"] === rubricId-"0") {
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

    for(var userIndex = 0; userIndex < users.length; userIndex++) {
        allUserNames[users[userIndex]["user_id"]] = users[userIndex]["first_name"] + " " + users[userIndex]["last_name"];
    }

    return allUserNames;
}

export function parseCourseRoles(courses) {
    var allCourseRoles = {};

    for(var courseRoleIndex = 0; courseRoleIndex < courses.length; courseRoleIndex++) {
        allCourseRoles[courses[courseRoleIndex]["course_id"]] = courses[courseRoleIndex]["role_id"];
    }

    return allCourseRoles;
}

export function parseAssessmentIndividualOrTeam(assessmentTasks) {
    var allAssessments = {};

    for(var assessmentIndex = 0; assessmentIndex < assessmentTasks.length; assessmentIndex++) {
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

// NOTE: This function is used to format the Date so that it doesn't have any timezone issues
export function formatDueDate(dueDate, timeZone) {
    const timeZoneMap = {
        "EST": "America/New_York",
        "CST": "America/Chicago",
        "MST": "America/Denver",
        "PST": "America/Los_Angeles",
        "UTC": ""
    };

    const timeZoneId = timeZoneMap[timeZone];

    const zonedDueDate = zonedTimeToUtc(dueDate, timeZoneId);

    const formattedDueDate = format(zonedDueDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", { timeZone: timeZoneId });

    return formattedDueDate;
};

export function getDueDateString(dueDate) {
    let year = dueDate.getFullYear();

    let month = dueDate.getMonth() + 1;

    let day = dueDate.getDay();

    let hours = dueDate.getHours();

    let minutes = dueDate.getMinutes();

    let seconds = dueDate.getSeconds();

    let milliseconds = dueDate.getMilliseconds();

    let dueDateString = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

    return dueDateString;
}

export function getHumanReadableDueDate(dueDate, timeZone) {
    dueDate = dueDate.substring(5);

    var month = Number(dueDate.substring(0, 2)) - 1;

    dueDate = dueDate.substring(3);

    var day = Number(dueDate.substring(0, 2));

    dueDate = dueDate.substring(3);

    var hour = Number(dueDate.substring(0, 2));

    var twelveHourClock = hour < 12 ? "am": "pm";

    hour = hour > 12 ? (hour % 12) : hour;

    hour = hour === 0 ? 12 : hour;

    dueDate = dueDate.substring(3);

    var minute = Number(dueDate.substring(0, 2));

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    var minutesString = minute < 10 ? ("0" + minute): minute;

    var timeString = `${hour}:${minutesString}${twelveHourClock}`;

    var dueDateString = `${monthNames[month]} ${day} at ${timeString} ${timeZone ? timeZone : ""}`;

    return dueDateString;
}

const modules = {
    genericResourceFetch
};

export default modules;