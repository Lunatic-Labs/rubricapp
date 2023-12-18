import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../Error/ErrorMessage';

class SetNewPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null
        }
        this.setPassword = () => {
            var pass1 = document.getElementById("password").value;
            var pass2 = document.getElementById("password2").value;
            
            console.log("setting password", pass1, pass2);
            if (pass1 === pass2) {
            }
            else {
                this.setState(() => ({
                    errorMessage: "passwords do not match"
                }))
            }

        }
    }
    render() {
        console.log(this.state.errorMessage)
        return (
            <>
                {this.state.errorMessage &&
                    <>
                        <div className='container'>
                            <ErrorMessage fetchedResource={"Set Password"} errorMessage={this.state.errorMessage} />
                        </div>
                    </>
                }
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <h1 className="mt-5">Set New Password</h1>
                    <div className="card d-flex gap-3 p-4" style={{ "width": "40rem" }}>
                        <div className="d-flex justify-content-around gap-3">
                            <label className='fs-4' style={{ "width": "30%" }}>Password</label>
                            <input id="password" name="password" type="text" className='w-50' />
                        </div>
                        <div className="d-flex justify-content-around gap-3">
                            <label className='fs-4' style={{ "width": "30%" }}>Retype Password</label>
                            <input id="password2" name="password2" type="password2" className='w-50' />
                        </div>
                        <button onClick={this.setPassword} className="btn btn-dark fs-4">Login</button>
                    </div>
                </div>
            </>
        )
    }
}

export default SetNewPassword;