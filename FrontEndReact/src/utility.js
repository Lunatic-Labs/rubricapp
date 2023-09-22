import { API_URL } from './App'; 
import Cookies from 'universal-cookie';

async function genericResourceFetch(fetchURL, resource, component) {
    const cookies = new Cookies();
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');
    const user_id = cookies.get('user_id');
    if(access_token && refresh_token && user_id) {
        const response = await fetch(
            API_URL + fetchURL,
            {
                headers: {
                    "Authorization": "Bearer " + access_token
                }
            }
        ).catch(
            (error) => {
                component.setState({
                    isLoaded: true,
                    errorMessage: error
                });
                return {
                    'success': false
                }
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