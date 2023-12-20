import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';
import Cookies from 'universal-cookie';
import { API_URL } from '../../App';
import SetNewPassword from './SetNewPassword';
import Login from './Login';
import Button from '@mui/material/Button';

class ValidateReset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null, 
            enteredCode: null,
            sentEmail: null,
            email: null,
            goBack: null
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
            console.log(code)
            fetch(
                API_URL + `/reset_code?email=${email}&code=${code}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer '
                    }
                }
            )
            .then(res => res.json())
            .then(
                (result) => {
                    const cookies = new Cookies();
                    cookies.set('access_token', result['access_token'], {sameSite: 'strict'});
                    cookies.set('refresh_token', result['refresh_token'], {sameSite: 'strict'});
                    console.log(result)
                    cookies.set('user', result['content']['user'][0], {sameSite: 'strict'});
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
        const { errorMessage, enteredCode, sentEmail, goBack} = this.state;
        const backButton = <Button id="cancelEditTeam" style={{
                backgroundColor: "black",
                color:"white",
                margin: "10px 5px 5px 0"
            }}
            onClick={() => {
                this.setState({
                    goBack: true,
                    });}}>
            Back </Button>
        
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
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 className="mt-5">Set New Password</h1>
                    <div className="card d-flex gap-3 p-4 align-items-center" style={{ "width": "40rem" }}>
                        <label className='fs-5'>Please enter your email</label>
                        <input id="email" name="email" type="text" className="w-50" />
                        <button onClick={this.sendEmail} className="btn btn-dark fs-4">Confirm</button>
                </div>
                {backButton}
            </div> 
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