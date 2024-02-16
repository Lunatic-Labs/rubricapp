import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage.js';
import SetNewPassword from './SetNewPassword.js';
import Login from './Login.js';
import { Button, TextField, FormControl, Box, Typography } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { API_URL } from '../../App.js';



class ValidateReset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 'ValidateResetPage',
            errorMessage: null,
            email: '',
            code: '',
        };
        
        this.sendEmail = () => {
            let email = this.state.email;

            if (email.trim() === '') {
                this.setState({
                    errorMessage: 'Email cannot be empty.'
                });

            } else {
                fetch(API_URL + `/reset_code?email=${email}`);

                this.setState({
                    activeTab: "SendCodePage"
                });
            }
        }

        this.validateCode = () => {
            let email = this.state.email;
            let code = this.state.code;

            if (code.trim() === '' || code.trim().length !== 6) {
                this.setState({
                    errorMessage: 'Make sure your code is correct.'
                });

            } else {
                fetch(
                    API_URL + `/reset_code?email=${email}&code=${code}`,
                    { method: 'POST' }
                )

                .then(res => res.json())

                .then(
                    (result) => {
                        if (result['success']) {
                            this.setState({
                                activeTab: "SetNewPasswordPage"
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
    }

    render() {
        const {
            activeTab,
            errorMessage,
            email,
            code,
        } = this.state;
        
        if (activeTab === "LoginPage") {
            return( <Login/> );
        }

        if (activeTab === "ValidateResetPage") {
            return (
                <>
                    {errorMessage &&
                        <Box>
                            <ErrorMessage fetchedResource={"Validate Reset"} errorMessage={errorMessage} />
                        </Box>
                    }

                    <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                        <Box className="form-position">
                            <Box className="card-style">
                                <FormControl className='form-spacing' aria-label="validate_reset_form">
                                    <Box>
                                        <Typography
                                            variant="h4"
                                            component="div"

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

                                            aria-label='validate_reset_title'
                                        >
                                            Validate Reset
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <form>
                                            <TextField
                                                margin='normal'
                                                required
                                                fullWidth
                                                id="email"
                                                label="Please enter your email"
                                                type="text"
                                                name="email"
                                                value={email}

                                                onChange={
                                                    (e) => {
                                                        this.setState({
                                                            email: e.target.value
                                                        });
                                                    }
                                                }

                                                aria-label='validate_reset_email_input'
                                            />
                                        </form>
                                    </Box>

                                    <Box sx={{display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                        <Box>
                                            <Button
                                                id="validateResetBackButton"
                                                variant="outlined"

                                                onClick={() => {
                                                    this.setState({
                                                        activeTab: "LoginPage"
                                                    });
                                                }}

                                                aria-label="validate_reset_back_button"
                                            >
                                                Back
                                            </Button>
                                        </Box>

                                        <Box>
                                            <Button
                                                onClick={this.sendEmail}
                                                type="button"
                                                variant="contained"
                                                className="primary-color"
                                                aria-label="validate_reset_confirm_button"
                                            >
                                                Confirm
                                            </Button>
                                        </Box>
                                    </Box>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </>
            )

        } else if (activeTab === "SendCodePage"){
            return (
                <>
                    {errorMessage &&
                        <Box>
                            <ErrorMessage fetchedResource={"Send Code"} errorMessage={errorMessage} />
                        </Box>
                    }

                    <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                        <Box className="form-position">
                            <Box className="card-style">
                                <FormControl className='form-spacing' aria-label='enter_code_form'>
                                    <Box>
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
                                            Code Required
                                        </Typography>

                                        <Typography variant="h6" component="div"
                                            sx={{
                                                fontFamily: "Roboto",
                                                fontSize: {xs:"12px", md:"18px"},
                                                fontStyle: "normal",
                                                color: "#B8B5BB",
                                                fontWeight: "500",
                                                lineHeight: "160%",
                                                letterSpacing: "0.15px",
                                                textAlign:"center"
                                            }}
                                        >
                                            We have sent a code to {this.state.email}
                                        </Typography>
                                    </Box>

                                    <Box>
                                        <MuiOtpInput
                                            autoFocus
                                            required
                                            id="code"
                                            name="code"
                                            value={code}

                                            onChange={
                                                (newCode) => {
                                                    this.setState({
                                                        code: newCode
                                                    });
                                                }
                                            }

                                            length={6}
                                            aria-label='send_code_input'
                                        />
                                    </Box>

                                    <Box sx={{display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                        <Box>
                                            <Button
                                                id="sendCodeBackButton"
                                                variant="outlined"

                                                onClick={() => {
                                                    this.setState({
                                                        activeTab: "ValidateResetPage",
                                                        errorMessage: null,
                                                        code: ''
                                                    });
                                                }}

                                                aria-label="send_code_back_button"
                                            >
                                                Back
                                            </Button>
                                        </Box>

                                        <Box>
                                            <Button
                                                onClick={this.validateCode}
                                                type="button"
                                                variant="contained"
                                                className="primary-color"
                                                aria-label='verify_code_button'
                                            >
                                                Verify
                                            </Button>
                                        </Box>
                                    </Box>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </>
            )

        } else if (activeTab === "SetNewPasswordPage") {
            return (
                <SetNewPassword
                    email={email}
                />
            );
        }
    }
}

export default ValidateReset;