import React, { Component } from 'react';
import ErrorMessage from '../Error/ErrorMessage.js';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import AppState from '../Navbar/AppState.js';
import SetNewPassword from './SetNewPassword.js';
import ValidateReset from './ValidateReset.js';
import { apiUrl } from '../../App.js';
import { Grid, Button, Link, TextField, FormControl, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Loading from '../Loading/Loading.js';



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
            showPassword:'',

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

        this.handleTogglePasswordVisibility = () => {
            this.setState({
                showPassword: !this.state.showPassword,
                errors: {
                    ...this.state.errors,
                    password: '',
                },
            });
        };

        this.login = () => {
            const {
                email,
                password,
            } = this.state;

            if (email.trim() === '' || password.trim() === '') {
                this.setState({
                    errors: {
                        email: email.trim() === '' ? 'Email cannot be empty' : '',
                        password: password.trim() === '' ? 'Password cannot be empty' : '',
                    },
                });

            } else {
                fetch(
                    apiUrl + `/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
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

            const refreshToken = cookies.get('refresh_token');
            const userId = cookies.get('user')["user_id"];

            fetch(
                apiUrl + `/refresh?user_id=${userId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + refreshToken
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

        this.keyPress = (e) => {
            if (e.key == 'Enter') {
                this.login();
            };
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
            showPassword,
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
                            <Box>
                                <ErrorMessage errorMessage={errorMessage} />
                            </Box>
                        </>
                    }

                    <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                        <Box role="form" className="form-position">
                            <Box className="card-style">
                                <FormControl className="form-spacing">
                                    <form aria-label='loginForm' onKeyDown={this.keyPress}>
                                        <Typography variant="h6" component="div"
                                            sx={{
                                                color: "#2E8BEF",
                                                fontFeatureSettings: "'clig' off, 'liga' off",
                                                fontFamily: "Roboto",
                                                fontSize: {xs:"24px", md:"30px"},
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                lineHeight: "160%",
                                                letterSpacing: "0.15px",
                                                textAlign:"center"
                                            }}
                                        >
                                            SkillBuilder
                                        </Typography>
            
                                        <Box>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoComplete='username'
                                                id="email"
                                                label="Email Address"
                                                type="text"
                                                name="email"
                                                error={!!errors.email}
                                                helperText={errors.email}
                                                value={email}
                                                onChange={this.handleChange}
                                                onKeyDown={this.keyPress}
                                                aria-label="emailInput"
                                            />

                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoComplete='current-password'
                                                name="password"
                                                label="Password"
                                                type={showPassword ? 'text' : 'password'}
                                                id="password"
                                                value={password}
                                                error={!!errors.password}
                                                helperText={errors.password}
                                                onChange={this.handleChange}
                                                onKeyDown={this.keyPress}
                                                aria-label="passwordInput"
                                                InputProps={{
                                                    endAdornment: (
                                                      <InputAdornment position="end">
                                                        <IconButton
                                                          aria-label="toggle password visibility"
                                                          onClick={this.handleTogglePasswordVisibility}
                                                          edge="end"
                                                        >
                                                          {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                      </InputAdornment>
                                                    ),
                                                }}
                                            />

                                            <Grid sx={{textAlign:'right', mb:1}}>
                                                <Grid>
                                                    <Link
                                                        href= "#"
                                                        sx={{color: "#2E8BEF"}}
                                                        onClick={this.resetPassword}
                                                        aria-label='resetPasswordButton'
                                                    >
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
                                                aria-label="loginButton"
                                            >
                                                Sign In
                                            </Button>
                                        </Box>
                                    </form>
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
                <Loading />
            )
        }

        else {
            if (hasSetPassword === false) {
                return(
                    <SetNewPassword
                        email={email}
                    />
                )
            }

            else {
                return(
                    <AppState
                        userName={cookies.get('user')['user_name']}
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