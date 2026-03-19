import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';
import Login from './Login';
import { Button, TextField, FormControl, Box, Typography, InputAdornment, IconButton } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { apiUrl } from '../../App';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MAX_PASSWORD_LENGTH } from '../../Constants/password';
import {
    validatePasswordField,
    submitPasswordChange,
    testPasswordStrength,
    getPasswordStrengthIcon,
    generatePasswordStrengthColors
} from '../../utils/passwordUtils';

interface SetNewPasswordProps {
    readonly email: string;
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
    validatePasswordLength: any;
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

        // handleChange uses shared validation utility
        this.handleChange = (e: any) => {
            const { id, value } = e.target;
            const errorMessage = validatePasswordField(id, value);

            this.setState({
                [id]: value,
                errors: {
                    ...this.state.errors,
                    [id]: errorMessage,
                },
            } as any);
        };

        // getIcon uses shared utility
        this.getIcon = (strength: any) => {
            const iconName = getPasswordStrengthIcon(strength);
            return iconName === 'CheckIcon' ? CheckIcon : ErrorOutlineIcon;
        };

        // generateColors uses shared utility
        this.generateColors = (strength: any) => {
            return generatePasswordStrengthColors(strength);
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

        // Reusable validation method to check password length
        this.validatePasswordLength = (password: string, fieldName: string) => {
            if (password.length > MAX_PASSWORD_LENGTH) {
                this.setState({
                    errorMessage: `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
                });
                return false;
            }
            return true;
        };

        // testPasswordStrength uses shared utility
        this.testPasswordStrength = (password: any) => {
            return testPasswordStrength(password);
        };

        // 2 new 'validation' / error handling statements were added below
        // both check that character length does not exceed MAX_PASSWORD_LENGTH
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
            if (!this.validatePasswordLength(pass1, 'password')) {
                return;
            }

            // this is an error check to see if confirmationPassword is not exceeding 20 characters
            if (!this.validatePasswordLength(pass2, 'confirmationPassword')) {
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

            // Use shared password submission utility
            (submitPasswordChange as any)(apiUrl, this.props.email, pass1)
                .then((result: any) => {
                    if(result['success']) {
                        this.setState({
                            isPasswordSet: true
                        });
                    } else {
                        this.setState({
                            errorMessage: result['message']
                        });
                    }
                })
                .catch((error: any) => {
                    this.setState({
                        errorMessage: error
                    });
                });
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