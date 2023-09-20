import { Component } from 'react';
import Cookies from 'universal-cookie';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout() {
        const cookies = new Cookies();
        const access_token = cookies.get('access_token');
        const refresh_token = cookies.get('refresh_token');
        const user_id = cookies.get('user_id');
        fetch(
            `http://127.0.0.1:5000/api/logout?user_id=${user_id}&access_token=${access_token}&refresh_token=${refresh_token}`,
            {
                method:'POST'
            }
        )
        .then(res => res.json())
        .then(
            (result) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user_id');
                window.location.reload(false);
            },
            (error) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user_id');
                window.location.reload(false);
            }
        )
    }
    render() {
        return(
            <>
                <button className='btn bg-primary text-white' onClick={this.handleLogout}>Logout</button>
            </>
        )
    }
}

export default Logout;