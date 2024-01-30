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
            passSet: false,
            password: '',
            password2: '',

            errors : {
                password: '',
                password2: ''
            },

            PasswordStrength : {
                STRONG: 'STRONG',
                MEDIUM: 'MEDIUM',
                WEAK: 'WEAK'

        }
    }

        this.handleChange = (e) => {
            const { id, value } = e.target;
            this.testingPasswordStrength(value)
            this.setState({
              [id]: value,
              errors: {
                ...this.state.errors,
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
              },
            });

        };

        this.getIcon = (strength) => {

            let icon = ErrorOutlineIcon;
        
            switch(strength) {
                default: 
                    icon = ErrorOutlineIcon;
                    break;
                case 'WEAK':
                    icon = ErrorOutlineIcon;
                    break;
                case 'MEDIUM':
                    icon = ErrorOutlineIcon;
                    break;
                case 'STRONG':
                    icon = CheckIcon;
                    break;
            }
        
            return icon;
        };

        this.generateColors = (strength) => {
            let result = [];
            const COLORS = {
                NEUTRAL: '#E2E2E2',
                WEAK: '#B40314',
                MEDIUM: '#D39323',
                STRONG: '#7B927F',
            };
        
            switch(strength) {
                default: 
                    result = [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
                    break;
                case 'WEAK':
                    result = [COLORS.WEAK, COLORS.NEUTRAL, COLORS.NEUTRAL, COLORS.NEUTRAL];
                    break;
                case 'MEDIUM':
                    result = [COLORS.MEDIUM, COLORS.MEDIUM, COLORS.NEUTRAL, COLORS.NEUTRAL];
                    break;
                case 'STRONG':
                    result = [COLORS.STRONG, COLORS.STRONG, COLORS.STRONG, COLORS.STRONG];
                    break;
            }
        
            return result;
        };

        this.testingPasswordStrength = (password) => {
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
            var pass2 = this.state.password2;
            var security = this.state.PasswordStrength;
            if (pass1 === pass2) {

                var valid = validPasword(pass1);

                if(valid === true)
                {
                    let body = JSON.stringify({
                        'password': pass1
                        })
                    
                    genericResourcePUT("/password", this, body)
                    
                    this.setState(() =>( {
                        passSet: true
                    }))
                }
                else 
                {
                    this.setState(() => ({
                        errorMessage: "Password must have " + valid
                       
                    }))
                }              
            }
            else {
                this.setState(() => ({
                    errorMessage: "Passwords do not match",

                    errors: {
                        password: "Password do not match",
                        password2: "Password do not match"
                    },
                }))
            }

        }
    }
    render() {
        const {
            errorMessage,
            passSet,
            password,
            password2,
            errors
        } = this.state;
        const passwordStrength = this.testingPasswordStrength(password)
        const colors = this.generateColors(passwordStrength);
        const Icon = this.getIcon(passwordStrength);

        if (!passSet)
        {
            return (
                <>
                    {errorMessage &&
                        <>
                            <div className='container'>
                                <ErrorMessage errorMessage={this.state.errorMessage} />
                            </div>
                        </>
                    }
                     <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                        <Box role="form" className="form-position">
                            <Box className="card-style">
                                <FormControl className="form-spacing">
                                    <Box>
                                    <Typography variant="h4" component="div" sx={{
                                        fontFeatureSettings: "'clig' off, 'liga' off",
                                        fontFamily: "Roboto",
                                        fontSize: {xs:"16px", md:"24px"},
                                        fontStyle: "normal",
                                        fontWeight: "500",
                                        lineHeight: "160%",
                                        letterSpacing: "0.15px",
                                        textAlign:"center"
                                        }}>
                                        Enter your new password
                                    </Typography>
            
                                        <Box>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                autoFocus
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
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password2"
                                                label="Retype Password"
                                                type="password"
                                                id="password2"
                                                value={password2}
                                                error={!!errors.password2}
                                                helperText={errors.password2}
                                                onChange={this.handleChange}
                                            />
                                            <Box sx={{display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
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
                                        </Box>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                    {/* <div className="container d-flex flex-column justify-content-center align-items-center">
                        <h1 className="mt-5">Set New Password</h1>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-5' style={{ "width": "30%" }}>Password</label>
                                <input id="password" name="password" type="password" className='w-50' />
                            </div>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-5' style={{ "width": "30%" }}>Retype Password</label>
                                <input id="password2" name="password2" type="password" className='w-50' />
                            </div>
                            <button onClick={this.setPassword} className="btn btn-dark fs-4">Reset Password</button>
                        </div> */}
                </>
            )
        }
        else 
        {
            return (
              <Login/>
            )
        }
    }
}

export default SetNewPassword;