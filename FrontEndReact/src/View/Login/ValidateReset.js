import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import { API_URL } from '../../App.js';
import SetNewPassword from './SetNewPassword.js';
import Login from './Login.js';
import { Grid, Button, Link, TextField, FormControl, Checkbox, Box, Typography, FormControlLabel, Container  } from '@mui/material';


class ValidateReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null, 
            enteredCode: null,
            sentEmail: null,
            email: null,
            goBack: null,

            errors: {
                email: '',
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
        
        this.sendEmail = () => {
            let email = document.getElementById("email").value;
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
            let code = document.getElementById("code").value;
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
        const { errorMessage, enteredCode, sentEmail, goBack, email, errors} = this.state;
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
                                {/* <input id="email" name="email" type="text" className="w-50" /> */}
                            
                            </FormControl>
                        </Box>
                    </Box>
                    
                </Box>
                {/* <Box className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 aria-label='reset_password_title' className="mt-5">Set New Password</h1>
                    <Box className="card d-flex gap-3 p-4 align-items-center" style={{ "width": "40rem" }}>
                        <label className='fs-5'>Please enter your email</label>
                        <input id="email" name="email" type="text" className="w-50" />
                        <button onClick={this.sendEmail} className="btn btn-dark fs-4">Confirm</button>
                </Box> */}
                
            
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
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 className="mt-5">Set New Password</h1>
                    <div className="card d-flex gap-3 p-4 align-items-center" style={{ "width": "40rem" }}>
                        <label className='fs-5'>Please enter the code sent to your email</label>
                        <input id="code" name="code" type="text" className="w-50" />
                        <button onClick={this.validateCode} className="btn btn-dark fs-4">Confirm</button>
                </div>
                {backButton}
            </div>
            </>
        )
        }
        else {
            return <SetNewPassword/>
        }
    }
}

export default ValidateReset;