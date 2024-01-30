import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import { API_URL } from '../../App.js';
import SetNewPassword from './SetNewPassword.js';
import Login from './Login.js';
import { Button, TextField, FormControl, Box, Typography } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input'


class ValidateReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null, 
            enteredCode: null,
            sentEmail: null,
            email: '',
            goBack: null,
            code: '',

            errors: {
                email: '',
                code: ''
            }
        };

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

        this.OTPChange = (newValue) => {
            this.setState({
                code: newValue
            })
          };
        
        this.sendEmail = () => {
            let email = this.state.email;
            if (email.trim() === '') {
                this.setState({
                    errors: {
                        email: email.trim() === '' ? 'Email cannot be empty' : '',
                    },
                });
            };
            fetch(
                API_URL + `/reset_code?email=${email}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer '
                    }
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    if(result["success"]) {
                        document.getElementById("email").value = "";
                        this.setState(() => ({
                            sentEmail: true,
                            email: email
                        }))
                    }
                    else {
                        this.setState(() => ({
                            errorMessage: result["message"]
                        }))
                    }
                }
            )
        }

        this.validateCode = () => {
            let email = this.state.email;
            let code = this.state.code;
            if (code.trim() === '') {
                this.setState({
                    errors: {
                        code: code.trim() === '' ? 'Code cannot be empty' : '',
                    },
                });
            };
            fetch(
                API_URL + `/reset_code?email=${email}&code=${code}`,
                {
                    method: 'POST'
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    const cookies = new Cookies();
                    cookies.set('access_token', result['headers']['access_token'], {sameSite: 'strict'});
                    cookies.set('refresh_token', result['headers']['refresh_token'], {sameSite: 'strict'});
                    cookies.set('user', result['content']['reset_code'][0], {sameSite: 'strict'});
                    if(result["success"]) {
                        this.setState(() => ({
                            enteredCode: true 
                        }))
                    }
                    else {
                        cookies.remove('access_token');
                        cookies.remove('refresh_token');
                        cookies.remove('user');
                        this.setState(() => ({
                            errorMessage: result["message"]
                        }))
                    }
                }
            )
        }

    } 
   
    render() {
        const { errorMessage, enteredCode, sentEmail, goBack, email, code, errors} = this.state;
        const backButton = <Button id="cancelEditTeam" variant="outlined"
            onClick={() => {
                this.setState({
                    goBack: true,
                    });}}>
                    Back 
                </Button>
        
        if (goBack) {
            return(
            <Login/>)
        }

        if (!sentEmail) {
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
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className='form-spacing'>
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
                                        Set New Password
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
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        value={email}
                                        onChange={this.handleChange}
                                    />
                                       </form>
                                </Box>
                                <Box sx={{display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                    <Box>
                                        {backButton}
                                    </Box>
                                    <Box>
                                        <Button 
                                            onClick={this.sendEmail}
                                            type="button"
                                            variant="contained"
                                            className="primary-color"
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
        }
        else if (!enteredCode){
            return ( 
                <>
                 {errorMessage &&
                    <>
                        <div className='container'>
                            <ErrorMessage fetchedResource={"Set Password"} errorMessage={this.state.errorMessage} />
                        </div>
                    </>
                }
                 <Box sx={{ justifyContent:"center", minHeight:"100vh", width:"100%" }} className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className='form-spacing'>
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
                                        Code Required
                                    </Typography>
                                    <Typography variant="h6" component="div" sx={{
                                        fontFamily: "Roboto",
                                        fontSize: {xs:"12px", md:"18px"},
                                        fontStyle: "normal",
                                        color: "#B8B5BB",
                                        fontWeight: "500",
                                        lineHeight: "160%",
                                        letterSpacing: "0.15px",
                                        textAlign:"center"
                                        }}>
                                        We have sent a code to {this.state.email}
                                    </Typography>
                                </Box>
                                <Box>
                                    {/* <TextField
                                        margin='normal'
                                        required
                                        fullWidth
                                        id="code"
                                        label="Please enter the code sent to your email"
                                        type="text"
                                        name="code"
                                        error={!!errors.code}
                                        helperText={errors.code}
                                        value={code}
                                        onChange={this.handleChange}
                                    /> */}
                                    <MuiOtpInput autoFocus required id="code" name="code" value={code} onChange={this.OTPChange}
                                    length={6}
                                    />
                                </Box>
                                <Box sx={{display: "flex" , flexDirection: "row", justifyContent: "right", gap: "20px" }}>
                                    <Box>
                                        {backButton}
                                    </Box>
                                    <Box>
                                        <Button 
                                            onClick={this.validateCode}
                                            type="button"
                                            variant="contained"
                                            className="primary-color"
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
        }
        else {
            return <SetNewPassword/>
        }
    }
}

export default ValidateReset;