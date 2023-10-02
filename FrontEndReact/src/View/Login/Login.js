import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.login = () => {
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            fetch(
                `http://127.0.0.1:5000/api/login?email=${email}&password=${password}`,
                {
                    method: "POST"
                }
            )
            .then(res => res.json())
            .then((result) => {
                if(result["success"]) {
                    console.log(result);
                    console.log(result["access_token"]);
                }
            })
        };
    }
    render() {
        return(
            <div className="container d-flex flex-column justify-content-center align-items-center">
                <h1 className="mt-5">Login</h1>
                <div className="card d-flex gap-3 p-4" style={{ "width":"40rem" }}>
                    <div className="d-flex justify-content-around gap-3">
                        <label className='fs-4'>Email</label>
                        <input id="email" name="email" type="text" />
                    </div>
                    <div className="d-flex justify-content-around gap-3">
                        <label className='fs-4'>Password</label>
                        <input id="password" name="password" type="password"/>
                    </div>
                    <button onClick={this.login} className="btn btn-dark fs-4">Login</button>
                </div>
            </div>
        )
    }
}

export default Login;