import React, { Component } from 'react';
import ErrorMessage from '../Error/ErrorMessage.js';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import AppState from '../Navbar/AppState.js';
import SetNewPassword from './SetNewPassword.js';
import ValidateReset from './ValidateReset.js';
import { API_URL } from '../../App.js';
// import { Grid, Button, Link, TextField, FormControl, Checkbox, Box, Typography, FormControlLabel, Container  } from '@mui/material';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: null,
            errorMessage: null,
            loggedIn: null,
            hasSetPassword: null,
            resettingPassword: null,
            email: '',
            password: '',

            errors: {
                email: '',
                password: '',
            }
        }

        this.handleChange = (e) => {
            const { id, value } = e.target;

            this.setState({
              [id]: value,
              errors: {
                ...this.state.errors,
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
              },
            });
        };

        this.login = () => {
            // const {
            //     email,
            //     password,
            // } = this.state;

            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;

            // if (email.trim() === '' || password.trim() === '') {
            //     // Handle validation error
            //     console.error('Validation error: Fields cannot be empty');
            //     this.setState({
            //         errors: {
            //             email: email.trim() === '' ? 'Email cannot be empty' : '',
            //             password: password.trim() === '' ? 'Password cannot be empty' : '',
            //         },
            //     });
            // } else {

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
                        cookies.set('access_token', result['headers']['access_token'], {sameSite: 'strict'});
                        cookies.set('refresh_token', result['headers']['refresh_token'], {sameSite: 'strict'});
                        cookies.set('user', result['content']['login'][0], {sameSite: 'strict'});

                        this.setState(() => ({
                            isLoaded: true,
                            loggedIn: true,
                            hasSetPassword: result['content']['login'][0]['has_set_password']
                        }));
                    } else {
                        cookies.remove('access_token');
                        cookies.remove('refresh_token');
                        cookies.remove('user');

                        this.setState(() => ({
                            isLoaded: true,
                            errorMessage: result["message"]
                        }));
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
                    }));
                }
            )
        // }
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
                    cookies.set('access_token', result['headers']['access_token'], {'sameSite': 'strict'});

                    this.setState({
                        loggedIn: null
                    });
                },
                (error) => {
                    cookies.remove('user');
                    cookies.remove('access_token');
                    cookies.remove('refresh_token');
                }
            )
        }

        this.resetPassword = () => {
            this.setState(() => ({
                resettingPassword: true
            }));
        }

        this.logout = () => {
            this.setState({
                isLoaded: null,
                errorMessage: null,
                loggedIn: null,
                hasSetPassword: null,
                resettingPassword: null
            });
        }
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            loggedIn,
            hasSetPassword,
            resettingPassword,
            // email,
            // password,
            // errors
        } = this.state;

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
                        {/* <Box style={{ paddingTop: "5rem" }} className="card-spacing">
                            <Box className="form-position">
                                <Box className="card-style">
                                    <FormControl className="form-spacing">
                                    <Typography component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                    <Box component="form" sx={{ mt: 1 }}>
                                        <TextField
                                        margin="normal"
                                        // required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        type="text"
                                        name="email"
                                        // autoComplete="email"
                                        // autoFocus
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        value={email}
                                        onChange={this.handleChange}
                                        />
                                        <TextField
                                        margin="normal"
                                        // required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={this.handleChange}
                                        // autoComplete="current-password"
                                        />
                                        <Button
                                        onClick={this.login}
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                        >
                                        Sign In
                                        </Button>
                                        <Grid container>
                                        <Grid item xs>
                                            <Link onClick={this.resetPassword}>
                                            Forgot password?
                                            </Link>
                                        </Grid>
                                        </Grid>
                                    </Box>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box> */}

                    <div role="form" className="container d-flex flex-column justify-content-center align-items-center">
                        <h1 className="mt-5">Login</h1>

                        <div className="card d-flex gap-3 p-4" style={{ "width":"40rem" }}>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-4' style={{"width":"30%"}}>Email</label>

                                <input aria-label="email_input" id="email" name="email" type="text" className='w-50' />
                            </div>

                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-4' style={{"width":"30%"}}>Password</label>

                                <input aria-label="password_input" id="password" name="password" type="password" className='w-50' />
                            </div>

                            <button aria-label="login_button" onClick={this.login} className="btn btn-dark fs-4">Login</button>
                        </div>

                        <button aria-label='reset_password_button' className="btn btn-link" onClick={this.resetPassword}>Reset password</button>
                    </div>
                </>
            )
        }

        else if (!loggedIn && (!cookies.get('access_token') && cookies.get('refresh_token') && cookies.get('user'))) {
            this.handleNewAccessToken();

            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        }

        else {
            if (hasSetPassword === false) {
                return(
                    <SetNewPassword/>
                )
            }

            else {
                return(
                    <AppState
                        user_name={cookies.get('user')['user_name']}
                        isSuperAdmin={cookies.get('user')['isSuperAdmin']}
                        isAdmin={cookies.get('user')['isAdmin']}
                        logout={this.logout}
                    />
                )
            }
        }
    }
}

export default Login;