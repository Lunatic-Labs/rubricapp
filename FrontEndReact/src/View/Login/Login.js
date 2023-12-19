import React, { Component } from 'react';
import ErrorMessage from '../Error/ErrorMessage';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import Navbar from '../Navbar/Navbar';
import SetNewPassword from './SetNewPassword';
import ValidateReset from './ValidateReset';
import { API_URL } from '../../App';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: null,
            errorMessage: null,
            loggedIn: null,
            hasSetPassword: null,
            resettingPassword: null
        }
        this.login = () => {
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            fetch(
                API_URL + `/login?email=${email}&password=${password}`,
                {
                    method: "POST"
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    const cookies = new Cookies();
                    if(result["success"]) {
                        cookies.set('access_token', result['access_token'], {sameSite: 'strict'});
                        cookies.set('refresh_token', result['refresh_token'], {sameSite: 'strict'});
                        cookies.set('user', result['content']['user'][0], {sameSite: 'strict'});
                        console.log(result)
                        this.setState(() => ({
                            isLoaded: true,
                            loggedIn: true,
                            hasSetPassword: result['content']['user'][0]['has_set_password']
                        }))
                        console.log(this.state.hasSetPassword)
                    } else {
                        cookies.remove('access_token');
                        cookies.remove('refresh_token');
                        cookies.remove('user');
                        this.setState(() => ({
                            isLoaded: true,
                            errorMessage: result["message"]
                        }))
                    }
                },
                (error) => {
                    const cookies = new Cookies();
                    cookies.remove('access_token');
                    cookies.remove('refresh_token');
                    cookies.remove('user');
                    this.setState(() => ({
                        isLoaded: true,
                        errorMessage: error
                    }))
                }
            )
        };
        this.handleNewAccessToken = () => {
            const cookies = new Cookies();
            const refresh_token = cookies.get('refresh_token');
            const user_id = cookies.get('user')["user_id"];
            fetch(
                API_URL + `/refresh?user_id=${user_id}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + refresh_token
                    }
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    cookies.set('access_token', result['access_token'], {'sameSite': 'strict'});
                },
                (error) => {
                    // TODO: Most likely add the logic to remove expired refresh_token
                    cookies.remove('access_token');
                }
            )
        }

        this.resetPassword = () => {
            this.setState(() => ({
                resettingPassword: true
            }))
        }
    }
    render() {
        const { isLoaded, errorMessage, loggedIn, hasSetPassword, resettingPassword } = this.state;
        const cookies = new Cookies();
        if (resettingPassword){
            return (<ValidateReset/>)
        }
        else if(!loggedIn && (!cookies.get('access_token') && !cookies.get('refresh_token') && !cookies.get('user'))) {
            return(
                <>
                    { isLoaded && errorMessage &&
                        <>
                            {/* A response has been received and an error occurred */}
                            <div className='container'>
                                <ErrorMessage fetchedResource={"Login"} errorMessage={errorMessage} />
                            </div>
                        </>
                    }
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <h1 className="mt-5">Login</h1>
                        <div className="card d-flex gap-3 p-4" style={{ "width":"40rem" }}>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-4' style={{"width":"30%"}}>Email</label>
                                <input id="email" name="email" type="text" className='w-50' />
                            </div>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-4' style={{"width":"30%"}}>Password</label>
                                <input id="password" name="password" type="password" className='w-50' />
                            </div>
                            <button onClick={this.login} className="btn btn-dark fs-4">Login</button>
                        </div>
                            <button type="button" class="btn btn-link" onClick={this.resetPassword}>Reset password</button>
                        
                    </div>
                </>            
            )
        } else if (!loggedIn && (!cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user'))) {
            this.handleNewAccessToken();
            return(
                <>
                    <div className='container'>
                        <h1>Loading...</h1>
                    </div>
                </>
            )
        } else {
            if (hasSetPassword === false) {
                return(<SetNewPassword/>)
            }
            else {
            return(
                <Navbar
                    isSuperAdmin={cookies.get('user')['isSuperAdmin']}
                    isAdmin={cookies.get('user')['isAdmin']}
                />
            )
            }
        }
    }
}

export default Login;