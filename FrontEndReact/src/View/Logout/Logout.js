import { Component } from 'react';
import Cookies from 'universal-cookie';
import { API_URL } from '../../App.js';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout() {
        const cookies = new Cookies();
        const access_token = cookies.get('access_token');
        const refresh_token = cookies.get('refresh_token');
        const user_id = cookies.get('user')['user_id'];

        fetch(
            API_URL + `/logout?user_id=${user_id}&access_token=${access_token}&refresh_token=${refresh_token}`,
            {
                method:'POST'
            }
        )
        .then(res => res.json())
        .then(
            (result) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');
                this.props.logout();
            },
            (error) => {
                cookies.remove('access_token');
                cookies.remove('refresh_token');
                cookies.remove('user');
                this.props.logout();
            }
        )
    }

    render() {
        return(
            <>
                <button aria-label='logout_button' className='btn bg-primary text-white' onClick={this.handleLogout}>Logout</button>
            </>
        )
    }
}

export default Logout;