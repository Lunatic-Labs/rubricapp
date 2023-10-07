import { API_URL } from './App'; 
import Cookies from 'universal-cookie';

async function genericResourceFetch(fetchURL, resource, component) {
    const cookies = new Cookies();
    if(cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user_id')) {
        const response = await fetch(
            API_URL + fetchURL,
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
        } else if(result['msg']==="BlackListed") {
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

export default genericResourceFetch;