import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';
import Login from './Login';
import { Button, TextField, FormControl, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { apiUrl } from '../../App';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MAX_PASSWORD_LENGTH } from '../../Constants/password';

interface SetNewPasswordProps {
    email: string;
}

interface SetNewPasswordState {
    errorMessage: any;
    isPasswordSet: boolean;
    password: string;
    confirmationPassword: string;
    showPassword: any;
    errors: {
        password: string;
        confirmationPassword: string;
    };
    PasswordStrength: {
        STRONG: string;
        MEDIUM: string;
        WEAK: string;
    };
}

class SetNewPassword extends Component<SetNewPasswordProps, SetNewPasswordState> {
    generateColors: any;
    getIcon: any;
    handleChange: any;
    handleTogglePasswordVisibility: any;
    setPassword: any;
    testPasswordStrength: any;
    constructor(props: SetNewPasswordProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isPasswordSet: false,
            password: '',
            confirmationPassword: '',
            showPassword:'',

            errors : {
                password: '',
                confirmationPassword: ''
            },

            PasswordStrength : {
                STRONG: 'STRONG',
                MEDIUM: 'MEDIUM',
                WEAK: 'WEAK'
            }
        }

        // handleChange has been altered to account for the 20 character limit for password
        this.handleChange = (e: any) => {
            const { id, value } = e.target;

            // This will create an error message if password is empty and/or exceeding the 20 character limit
            let errorMessage = '';
            if(value.trim() === '') {
                errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`;   // the old code from this.setState() has been re-used here
            } else if(id === 'password' && value.length > MAX_PASSWORD_LENGTH) {
                errorMessage = `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;                          // checks if password is not exceeding 20 characters
            } else if(id === 'confirmationPassword' && value.length > MAX_PASSWORD_LENGTH) {
                errorMessage = `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`;                          // checks if confirmationPassword is not exceeding 20 characters
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

        this.getIcon = (strength: any) => {
            switch(strength) {
                case 'STRONG':
                    return CheckIcon;
                case 'WEAK':
                case 'MEDIUM':
                    return ErrorOutlineIcon;
                default:
                // Unreachable case. Maybe add some logging or
                // something here.
                    return ErrorOutlineIcon;
            }
        };

        this.generateColors = (strength: any) => {
            const COLORS = {
                NEUTRAL: '#E2E2E2',
                WEAK: '#B40314',
                MEDIUM: '#D39323',
                STRONG: '#7B927F',
            };

            switch(strength) {
                case 'STRONG':
                    return [COLORS.STRONG, COLORS.STRONG, COLORS.STRONG, COLORS.STRONG];
                case 'WEAK':
                    return [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
                case 'MEDIUM':
                    return [COLORS.MEDIUM, COLORS.MEDIUM, COLORS.NEUTRAL, COLORS.NEUTRAL];
                default:
                    return [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
            }
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

        this.testPasswordStrength = (password: any) => {
            const atLeastMinimumLength = (password: any) => new RegExp(/(?=.{8,})/).test(password);
            const atLeastOneUppercaseLetter = (password: any) => new RegExp(/(?=.*?[A-Z])/).test(password);
            const atLeastOneLowercaseLetter = (password: any) => new RegExp(/(?=.*?[a-z])/).test(password);
            const atLeastOneNumber = (password: any) => new RegExp(/(?=.*?[0-9])/).test(password);
            const atLeastOneSpecialChar = (password: any) => new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);

            if (!password) return 'WEAK';

            let points = 0;

            if (atLeastMinimumLength(password)) points += 1;
            if (atLeastOneUppercaseLetter(password)) points += 1;
            if (atLeastOneLowercaseLetter(password)) points += 1;
            if (atLeastOneNumber(password)) points += 1;
            if (atLeastOneSpecialChar(password)) points += 1;
        
            if (points >= 5) return 'STRONG';
            if (points >= 3) return 'MEDIUM';

            return 'WEAK';
        }
        

        // 2 new 'validation' / error handling statemetns where added below
        // both check that character length does not exceed 20
        this.setPassword = () => {
            var pass1 = this.state.password;

            var pass2 = this.state.confirmationPassword;

            if (pass1 === '') {
                this.setState({
                    errorMessage: "Password cannot be empty"
                });

                return;
            }

            if (pass2 === '') {
                this.setState({
                    errorMessage: "Confirm Password cannot be empty"
                });

                return;
            }

            // this is an error check to see if password is not exceeding 20 characters
            if (pass1.length > MAX_PASSWORD_LENGTH) {
                this.setState({
                    errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
                });

                return;
            }

            // this is an error check to see if confirmationPassword is not exceeding 20 characters
            if (pass2.length > MAX_PASSWORD_LENGTH) {
                this.setState({
                    errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
                });

                return;
            }

            if (pass1 !== pass2) {
                this.setState(() => ({
                    errorMessage: "Passwords do not match",

                    errors: {
                        password: "Passwords do not match",
                        confirmationPassword: "Passwords do not match"
                    }
                }));

                return;
            }

            if (this.testPasswordStrength(pass1) !== "STRONG") {
                this.setState(() => ({
                    errorMessage: "Please verify your password strength"
                }));

                return;
            }

            fetch(
                apiUrl + "/password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: this.props.email,
                        password: pass1,
                    }),
                }
            )

            .then(res => res.json())

            .then(
                (result) => {
                    if(result['success']) {
                        this.setState({
                            isPasswordSet: true
                        });
                    } else {
                        this.setState({
                            errorMessage: result['message']
                        });
                    }
                }
            )

            .catch(
                (error) => {
                    this.setState({
                        errorMessage: error
                    });
                }
            );
        }
    }

    render() {
        const {
            errorMessage,
            isPasswordSet,
            password,
            confirmationPassword,
            errors,
            showPassword
        } = this.state;
       
        const passwordStrength = this.testPasswordStrength(password)
        const colors = this.generateColors(passwordStrength);
        const Icon = this.getIcon(passwordStrength);

        if (!isPasswordSet) {
            return <>
                {errorMessage &&
                    <Box>
                        <ErrorMessage errorMessage={errorMessage} />
                    </Box>
                }

                 <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                    <Box role="form" className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <form aria-label="setNewPasswordFormLabel">
                                    <Typography variant="h4" component="div" aria-label="setNewPasswordTitle"
                                        sx={{
                                            fontFeatureSettings: "'clig' off, 'liga' off",
                                            fontFamily: "Roboto",
                                            fontSize: {xs:"16px", md:"24px"},
                                            fontStyle: "normal",
                                            fontWeight: "500",
                                            lineHeight: "160%",
                                            letterSpacing: "0.15px",
                                            textAlign:"center"
                                        }}
                                    >
                                        Enter your new password
                                    </Typography>
        
                                    <Box>
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            autoFocus
                                            autoComplete="new-password"
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            value={password}
                                            error={!!errors.password}
                                            helperText={errors.password}
                                            onChange={this.handleChange}
                                            inputProps={{ maxLength: MAX_PASSWORD_LENGTH + 1 }}      // the maximum character length of password has been changed to MAX_PASSWORD_LENGTH, this accounts for browsers handling characters differently
                                            aria-label="setNewPasswordInput"
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
                                        
                                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", margin:"10px 0"}}>
                                            {colors.map((color: any,index: any) => (
                                                <Box key={index} bgcolor={color} sx={{ flex: 1, height:"5px", borderRadius:"5px"}}></Box>
                                            ))}
                                        </Box>

                                        <Box sx={{display:"flex", alignItems:"center", justifyContent:"flex-start", gap:"5px", margin:"0 0 15px 0"}}>
                                            <Icon style={{ color: colors[0]}}/>

                                            <Typography color={colors[0]}>{passwordStrength}</Typography>
                                        </Box>

                                        {passwordStrength !== "STRONG" &&(
                                            <>
                                                <Typography variant='subtitle2' fontSize="1rem" color="#9E9E9E" margin="0 0 8px 0">
                                                    To make your Password Stronger:
                                                </Typography>

                                                <Typography variant='subtitle2' fontSize="14px" color="#9E9E9E" margin="0 0 8px 0">
                                                    * Set a password with a minimum of eight characters. <br></br>
                                                    * Include a UpperCase letter. <br></br>
                                                    * Include at least One Number. <br></br>
                                                    * Include a Symbol ( ! @ # $ % ^ & *).
                                                </Typography>
                                            </>
                                        )}
                                    </Box>

                                    <TextField
                                        sx={{ mb: 3, mt: 2 }}
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="confirmationPassword"
                                        label="Retype Password"
                                        type="password"
                                        id="confirmationPassword"
                                        value={confirmationPassword}
                                        error={!!errors.confirmationPassword}
                                        helperText={errors.confirmationPassword}
                                        onChange={this.handleChange}
                                        inputProps={{ maxLength: MAX_PASSWORD_LENGTH + 1}}          // the maximum character length of confirmationPassword has been changed to MAX_PASSWORD_LENGTH, this accounts for browsers handling characters differently
                                        aria-label="setNewPasswordConfirmInput"
                                    />

                                    <Box sx={{ display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                        <Box>
                                            <Button
                                                onClick={this.setPassword}
                                                type="button"
                                                variant="contained"
                                                className="primary-color"
                                                aria-label="setNewPasswordButton"
                                            >
                                                Set Password
                                            </Button>
                                        </Box>
                                    </Box>
                                </form>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </>;

        } else { return ( <Login/> ); }
    }
}

export default SetNewPassword;