import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage.js';
import { genericResourcePUT, validPasword } from '../../utility.js';
import Login from './Login.js';
import { Button, TextField, FormControl, Box, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';



class SetNewPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isPasswordSet: false,
            password: '',
            confirmationPassword: '',

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

        this.handleChange = (e) => {
            const { id, value } = e.target;

            this.testPasswordStrength(value)

            this.setState({
                [id]: value,
                errors: {
                    ...this.state.errors,
                    [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
                },
            });
        };

        this.getIcon = (strength) => {
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

        this.generateColors = (strength) => {
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

        this.testPasswordStrength = (password) => {
            const atLeastMinimumLength = (password) => new RegExp(/(?=.{8,})/).test(password);
            const atLeastOneUppercaseLetter = (password) => new RegExp(/(?=.*?[A-Z])/).test(password);
            const atLeastOneLowercaseLetter = (password) => new RegExp(/(?=.*?[a-z])/).test(password);
            const atLeastOneNumber = (password) => new RegExp(/(?=.*?[0-9])/).test(password);
            const atLeastOneSpecialChar = (password) => new RegExp(/(?=.*?[#?!@$%^&*-])/).test(password);

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
        

        this.setPassword = () => {
            var pass1 = this.state.password;
            var pass2 = this.state.confirmationPassword;

            var passwordSecurity = this.testPasswordStrength(pass1);

            if (pass1 === pass2 && passwordSecurity === "STRONG") {
                if (validPasword(pass1)) {
                    let body = JSON.stringify({
                        'password': pass1
                    })

                    genericResourcePUT("/password", this, body)

                    this.setState(() =>({ isPasswordSet: true }));

                } else {
                    this.setState(() => ({ errorMessage: "Password must have " + validPasword(pass1) }));
                }

            } else {
                this.setState(() => ({
                    errorMessage: "Passwords do not match",

                    errors: {
                        password: "Passwords do not match",
                        confirmationPassword: "Passwords do not match"
                    }
                }));
            }
        }
    }

    render() {
        const {
            errorMessage,
            isPasswordSet,
            password,
            confirmationPassword,
            errors
        } = this.state;
       
        const passwordStrength = this.testPasswordStrength(password)
        const colors = this.generateColors(passwordStrength);
        const Icon = this.getIcon(passwordStrength);

        if (!isPasswordSet) {
            return (
                <>
                    {errorMessage &&
                        <Box>
                            <ErrorMessage errorMessage={errorMessage} />
                        </Box>
                    }

                     <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                        <Box role="form" className="form-position">
                            <Box className="card-style">
                                <FormControl className="form-spacing">
                                    <form>
                                        <Typography variant="h4" component="div"
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
                                                type="password"
                                                id="password"
                                                value={password}
                                                error={!!errors.password}
                                                helperText={errors.password}
                                                onChange={this.handleChange}
                                            />
                                            
                                            <Box sx={{display:"flex", alignItems:"center", justifyContent:"center", gap:"5px", margin:"10px 0"}}>
                                                {colors.map((color,index) => (
                                                    <Box key={index} bgcolor={color} sx={{ flex: 1, height:"5px", borderRadius:"5px"}}></Box>
                                                ))}
                                            </Box>

                                            <Box sx={{display:"flex", alignItems:"center", justifyContent:"flex-start", gap:"5px", margin:"0 0 15px 0"}}>
                                                <Icon style={{ color: colors[0]}}/>
                                                <Typography color={colors[0]}>{passwordStrength}</Typography>
                                            </Box>

                                            {this.state.PasswordStrength !== "STRONG" &&(
                                                <>
                                                    <Typography variant='subtitle2' fontSize="1rem" color="#9E9E9E" margin="0 0 8px 0">
                                                        To make your Password Stronger:
                                                    </Typography>

                                                    <Typography variant='subtitle2' fontSize="14px" color="#9E9E9E" margin="0 0 8px 0">
                                                        * Set a password with a minimum of eight characters. <br></br>
                                                        * Include a UpperCase letter. <br></br>
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
                                        />

                                        <Box sx={{ display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                            <Box>
                                                <Button
                                                    onClick={this.setPassword}
                                                    type="button"
                                                    variant="contained"
                                                    className="primary-color"
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
                </>
            )

        } else { return ( <Login/> ); }
    }
}

export default SetNewPassword;