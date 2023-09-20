import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Signup extends Component {
    constructor(props) {
        super(props);
        this.signup = () => {
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var checkPassword = document.getElementById("checkPassword").value;
            if(password===checkPassword) {
                fetch(
                    `http://127.0.0.1:5000/api/signup?email=${email}&password=${password}`,
                    {
                        method: "POST"
                    }
                )
                .then(res => res.json())
                .then((result) => {
                    if(result["success"]) {
                        window.location.href = 'http://127.0.0.1:3000/login';
                    }
                })
            }
        }
    }
    render () {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center">
                <h1 className="mt-5">Signup</h1>
                <div className="card d-flex gap-3 p-4" style={{ "width":"40rem" }}>
                    <div className="d-flex justify-content-around gap-3">
                        <label className='fs-4'>Email</label>
                        <input id="email" name="email" type="text" />
                    </div>
                    <div className="d-flex justify-content-around gap-3">
                        <label className='fs-4'>Password</label>
                        <input id="password" name="password" type="password"/>
                    </div>
                    <div className="d-flex justify-content-around gap-3">
                        <label className='fs-4' style={{ "width":"48%"}}>Check Password</label>
                        <input id="checkPassword" name="checkPassword" type="password"/>
                    </div>
                    <button onClick={this.signup} className="btn btn-dark fs-4">Signup</button>
                </div>
            </div>
        )
    }
}

export default Signup;