import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';
import { genericResourcePUT, validPasword } from '../../utility';
import Cookies from 'universal-cookie';
import Login from './Login';

class SetNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            passSet: false
        }
        this.setPassword = () => {
            var pass1 = document.getElementById("password").value;
            var pass2 = document.getElementById("password2").value;
    
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
                    errorMessage: "Passwords do not match"
                }))
            }

        }
    }
    render() {
        const { errorMessage, passSet } = this.state;
        const cookies = new Cookies();  
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
                    <div className="container d-flex flex-column justify-content-center align-items-center">
                        <h1 className="mt-5">Set New Password</h1>
                        <div className="card d-flex gap-3 p-4" style={{ "width": "40rem" }}>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-5' style={{ "width": "30%" }}>Password</label>
                                <input id="password" name="password" type="password" className='w-50' />
                            </div>
                            <div className="d-flex justify-content-around gap-3">
                                <label className='fs-5' style={{ "width": "30%" }}>Retype Password</label>
                                <input id="password2" name="password2" type="password" className='w-50' />
                            </div>
                            <button onClick={this.setPassword} className="btn btn-dark fs-4">Reset Password</button>
                        </div>
                    </div>
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