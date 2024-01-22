import React, { Component } from 'react';
import ErrorMessage from '../Error/ErrorMessage';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import AppState from '../Navbar/AppState';
import SetNewPassword from './SetNewPassword';
import ValidateReset from './ValidateReset';
import { API_URL } from '../../App';
import { Grid, Button, Link, TextField, FormControl, Box, Typography, Container } from '@mui/material';

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

            const {
                email,
                password,
            } = this.state;

            if (email.trim() === '' || password.trim() === '') {
                // Handle validation error
                console.error('Validation error: Fields cannot be empty');
                this.setState({
                    errors: {
                        email: email.trim() === '' ? 'Email cannot be empty' : '',
                        password: password.trim() === '' ? 'Password cannot be empty' : '',
                    },
                });
            } else {

            fetch(
                API_URL + `/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
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
            }
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
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            loggedIn,
            hasSetPassword,
            resettingPassword,
            email,
            password,
            errors
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
                        <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                            <Box className="form-position">
                                <Box className="card-style">
                                    <FormControl className="form-spacing">
                                        <Typography variant="h6" component="div" sx={{
                                            color: "#2E8BEF",
                                            fontFeatureSettings: "'clig' off, 'liga' off",
                                            fontFamily: "Roboto",
                                            fontSize: {xs:"24px", md:"30px"},
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            lineHeight: "160%",
                                            letterSpacing: "0.15px",
                                            textAlign:"center"
                                        }}>
                                            SkillBuilder
                                        </Typography>
            
                                        <Box>
                                            <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            type="text"
                                            name="email"
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            value={email}
                                            onChange={this.handleChange}
                                            />
                                            <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            value={password}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            onChange={this.handleChange}
                                            />
                                            <Grid sx={{textAlign:'right', mb:1}}>
                                            <Grid>
                                                <Link 
                                                href= "#"
                                                sx={{color: "#2E8BEF"}}
                                                onClick={this.resetPassword}>
                                                Forgot password?
                                                </Link>
                                            </Grid>
                                            </Grid>
                                            <Button
                                            onClick={this.login}
                                            type="button"
                                            fullWidth
                                            variant="contained"
                                            className='primary-color'
                                            sx={{ mt: 2, mb: 2 }}
                                            >
                                            Sign In
                                            </Button>  
                                    </Box>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>
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
                    />
                )
            }
        }
    }
}

export default Login;