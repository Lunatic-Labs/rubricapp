import { API_URL } from './App'; 
import Cookies from 'universal-cookie';

export async function genericResourceFetch(fetchURL, resource, component) {
    const cookies = new Cookies();
    if(cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user_id')) {
        const response = await fetch(
            API_URL + fetchURL + `&user_id=${cookies.get('user_id')}`,
            {
                headers: {
                    "Authorization": "Bearer " + cookies.get('access_token')
                }
            }
        ).catch(
            (error) => {
                component.setState({
                    isLoaded: true,
                    errorMessage: error
                });
            }
        )
        const result = await response.json();
        if(result['success']) {
            let state = {};
            state['isLoaded'] = true;
            state[resource] = result['content'][resource][0];
            component.setState(state);
        } else if(result['msg']==="BlackListed" || result['msg']==="No Authorization") {
            cookies.remove('access_token');
            cookies.remove('refresh_token');
            cookies.remove('user_id');
            window.location.reload(false);
        } else if (result['msg']==="Token has expired") {
            cookies.remove('access_token');
            window.location.reload(false);
        } else {
            component.setState({
                isLoaded: true,
                errorMessage: result['message']
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

export function parseUserNames(users) {
    // var allUserNames = {};
    for(var userIndex = 0; userIndex < users.length; userIndex++) {
        console.log(userIndex);
    }
    return users
}

const modules = {
    genericResourceFetch,
    parseRoleNames,
    parseRubricNames,
    parseUserNames
};

export default modules;