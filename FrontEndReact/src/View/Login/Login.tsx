import React, { Component } from 'react';
import ErrorMessage from '../Error/ErrorMessage';
import 'bootstrap/dist/css/bootstrap.css';
import Cookies from 'universal-cookie';
import AppState from '../Navbar/AppState';
import SetNewPassword from './SetNewPassword';
import ValidateReset from './ValidateReset';
import { apiUrl } from '../../App';
import { Grid, Button, Link, TextField, FormControl, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Loading from '../Loading/Loading';
import { MAX_PASSWORD_LENGTH } from '../../Constants/password';

/**
 * Creates an instance of the login component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * 
 * @property {boolean|null} state.isLoaded - Indicates if the login request or auth refresh has completed.
 * @property {string|null} state.errorMessage - Error message for failed login or expired session.
 * @property {boolean|null} state.loggedIn - Whether the user is authenticated.
 * @property {boolean|null} state.hasSetPassword - Whether the authenticated user has set their password.
 * @property {boolean|null} state.resettingPassword - Whether the password reset flow should be shown.
 * @property {boolean} state.isRefreshing - Indicates if the component is refreshing the access token in the background.
 * @property {string} state.email - The user-entered email.
 * @property {string} state.password - The user-entered password.
 * @property {boolean} state.showPassword - Controls the visibility of the password text.
 * 
 * @property {Object} state.errors - Input-specific error messages.
 * @property {string} state.errors.email - Error message for email field.
 * @property {string} state.errors.password - Error message for password field.
 */

interface LoginState {
    isLoaded: any;
    errorMessage: any;
    loggedIn: any;
    hasSetPassword: any;
    resettingPassword: any;
    isRefreshing: boolean;
    email: string;
    password: string;
    showPassword: boolean;
    errors: {
        email: string;
        password: string;
    };
}

class Login extends Component<{}, LoginState> {
    cookies: any;
    handleChange: any;
    handleTogglePasswordVisibility: any;
    keyPress: any;
    login: any;
    logout: any;
    resetPassword: any;
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            loggedIn: null,
            hasSetPassword: null,
            resettingPassword: null,
            isRefreshing: false,
            email: '',
            password: '',
            showPassword: false,

            errors: {
                email: '',
                password: '',
            }
        }

        /**
         * @method handleChange - Updates email or password fields while applying validation rules such as:
         *  - Required fields.
         *  - Maximum password length.
         * @param {*} e - the input event.
         */

        // handleChange has been altered to account for the 20 character limit for password
        this.handleChange = (e: any) => {
            const { id, value } = e.target;

            // This will create an error message if password is empty and/or exceeding the 20 character limit
            let errorMessage = '';
            if(value.trim() === '') {
                errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`;   // the old code from this.setState() has been re-used here
            } else if(id === 'password' && value.length > MAX_PASSWORD_LENGTH) {
                errorMessage = `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;
            }

            // this.setState() used to contain the code below.
            //
            //[id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
            //
            // part of it was moved to errrorMessage and replaced with [id]: errorMessage,
            this.setState({
                [id]: value,
                errors: {
                    ...this.state.errors,
                    [id]: errorMessage,
                },
            } as any);
        };

        /**
         * @method handleTogglePasswordVisibility - Toggles whether the password input is displayed as text or masked.
         */
        this.handleTogglePasswordVisibility = () => {
            this.setState({
                showPassword: !this.state.showPassword,
                errors: {
                    ...this.state.errors,
                    password: '',
                },
            });
        };

        /**
         * @method login - Attempts to authenticate the user against the backend:
         *  - Stores access + refresh tokens on success.
         *  - Displays backend error message on failure.
         */
        this.login = () => {
            var {
                email,
                password,
            } = this.state;

            email = email.toLowerCase();
            if (email.trim() === '' || password.trim() === '') {
                this.setState({
                    errors: {
                        email: email.trim() === '' ? 'Email cannot be empty' : '',
                        password: password.trim() === '' ? 'Password cannot be empty' : '',
                    },
                });

            } else {
                fetch(
                    apiUrl + "/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password,
                        }),
                    }
                )
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if (result["success"]) {
                                this.cookies.set('access_token', result['headers']['access_token'], { sameSite: 'strict' });
                                this.cookies.set('refresh_token', result['headers']['refresh_token'], { sameSite: 'strict' });
                                this.cookies.set('user', result['content']['login'][0], { sameSite: 'strict' });

                                this.setState(() => ({
                                    isLoaded: true,
                                    loggedIn: true,
                                    hasSetPassword: result['content']['login'][0]['has_set_password']
                                }));

                            } else {
                                this.cookies.remove('access_token');
                                this.cookies.remove('refresh_token');
                                this.cookies.remove('user');

                                this.setState(() => ({
                                    isLoaded: true,
                                    errorMessage: result["message"]
                                }));
                            }
                        },
                        (error) => {
                            this.cookies.remove('access_token');
                            this.cookies.remove('refresh_token');
                            this.cookies.remove('user');

                            this.setState(() => ({
                                isLoaded: true,
                                errorMessage: error
                            }));
                        }
                    )
            }
        };

        /**
         * @method resetPassword - Activates the password-reset workflow by navigating to <ValidateReset>.
         */
        this.resetPassword = () => {
            this.setState(() => ({
                resettingPassword: true
            }));
        }

        /**
         * @method logout - Clears login-related state and resets UI to pre-authentication mode.
         */
        this.logout = () => {
            this.setState({
                isLoaded: null,
                errorMessage: null,
                loggedIn: null,
                hasSetPassword: null,
                resettingPassword: null
            });
        }

        /**
         * @method keyPress - Listens for the Enter key to submit the login form.
         * @param {*} e - the keyboard input event.
         */

        this.keyPress = (e: any) => {
            if (e.key === 'Enter') {
                this.login();
            };
        }
    }

    componentDidMount() {
        this.cookies = new Cookies();
        this.checkAuthStatus();
    }

    /**
     * @method checkAuthStatus - Determines whether:
     *  - User has valid tokens → login automatically.
     *  - User has expired tokens → require login again.
     *  - User state is inconsistent → clear cookies and force logout.
     */
    checkAuthStatus = () => {
        const hasAccessToken = !!this.cookies.get('access_token');
        const hasRefreshToken = !!this.cookies.get('refresh_token');
        const hasUser = !!this.cookies.get('user');

        // No tokens - show login
        if (!hasAccessToken && !hasRefreshToken && !hasUser) {
            return;
        }

        // Inconsistent state - clear everything
        if ((!hasRefreshToken && hasUser) || (hasAccessToken && !hasRefreshToken)) {
            this.cookies.remove('access_token');
            this.cookies.remove('refresh_token');
            this.cookies.remove('user');

            this.setState({
                isLoaded: true,
                loggedIn: false,
                isRefreshing: false,
                errorMessage: "Session expired. Please log in again."
            });
            return;
        }

        // Has both tokens - user is logged in
        if (hasAccessToken && hasRefreshToken && hasUser) {
            this.setState({ loggedIn: true });
        }
    }


    render() {
        const {
            isLoaded,
            errorMessage,
            loggedIn,
            hasSetPassword,
            resettingPassword,
            isRefreshing,
            email,
            password,
            showPassword,
            errors
        } = this.state;

        // Handle password reset flow
        if (resettingPassword) {
            return (<ValidateReset />)
        }

        // Loading while checking auth or refreshing token
        if (isRefreshing) {
            return (<Loading />)
        }

        // Show login page if not logged in
        if (!loggedIn) {
            return (
                <>
                    {isLoaded && errorMessage &&
                        <>
                            <Box>
                                <ErrorMessage errorMessage={errorMessage} />
                            </Box>
                        </>
                    }

                    <Box sx={{ justifyContent: "center", minHeight: "100vh", width: "100%" }} className="card-spacing">
                        <Box role="form" className="form-position">
                            <Box className="card-style">
                                <FormControl className="form-spacing">
                                    <form aria-label='loginForm' onKeyDown={this.keyPress}>
                                        <Typography variant="h6" component="div"
                                            sx={{
                                                color: "#2E8BEF",
                                                fontFeatureSettings: "'clig' off, 'liga' off",
                                                fontFamily: "Roboto",
                                                fontSize: { xs: "24px", md: "30px" },
                                                fontStyle: "normal",
                                                fontWeight: "500",
                                                lineHeight: "160%",
                                                letterSpacing: "0.15px",
                                                textAlign: "center"
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
                                                inputProps={{ maxLength: MAX_PASSWORD_LENGTH + 1 }}      // the maximum character length of MAX_PASSWORD_LENGTH password has been changed to 21, this accounts for browsers handling characters differently
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

                                            <Grid sx={{ textAlign: 'right', mb: 1 }}>
                                                <Grid>
                                                    <Link
                                                        href="#"
                                                        sx={{ color: "#2E8BEF" }}
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

        // User is authenticated
        if (hasSetPassword === false) {
            return (
                <SetNewPassword
                    email={email}
                />
            )
        }

        // User logged in and has set password
        return (
            <AppState
                userName={this.cookies.get('user')['user_name']}
                isSuperAdmin={this.cookies.get('user')['isSuperAdmin']}
                isAdmin={this.cookies.get('user')['isAdmin']}
                logout={this.logout}
            />
        )
    }
}

export default Login;