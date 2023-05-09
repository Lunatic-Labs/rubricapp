import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './addStyles.css';

class AdminAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
        }
    }
    componentDidMount() {
        var createButton = document.getElementById("createButton");
        createButton.addEventListener("click", () => {
            var firstName = document.getElementById("firstName").value;
            var lastName = document.getElementById("lastName").value;
            var email = document.getElementById("email").value;
            var password = document.getElementById("password").value;
            var role = document.getElementById("role").value;
            var lms_id = document.getElementById("lms_id").value;
            var consent = document.getElementById("consent").value==="on";
            var owner_id = document.getElementById("owner_id").value;
            fetch( "http://127.0.0.1:5000/api/user",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "first_name": firstName,
                        "last_name": lastName,
                        "email": email,
                        "password": password,
                        "role": role,
                        "lms_id": lms_id,
                        "consent": consent,
                        "owner_id": owner_id
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result["success"] === false) {
                        this.setState({
                            errorMessage: result["message"]
                        })
                    }
                },
                (error) => {
                    this.setState({
                        error: error
                    })
                }
            )
        });
    }
    render() {
        const { error , errorMessage} = this.state;
        return (
            <React.Fragment>
                { error &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { error.message }</h1>
                        </React.Fragment>
                }
                { errorMessage &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { errorMessage }</h1>
                        </React.Fragment>
                }
                <div id='outside'>
                <h1 className="text-center mt-5">Add New User</h1>
                <div className="d-flex flex-column p-2 m-4"> 
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="firstNameLabel">First Name</label>
                        <input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="lastNameLabel">Last Name</label>
                        <input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="emailLabel">Email</label>
                        <input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{}} placeholder="example@email.com" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="passwordLabel">Password</label>
                        <input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{}} required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"heifht":"3rem"}}>
                        <label htmlFor="exampleDataList" className="form-label">Role</label>
                        <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{}} list="datalistOptions" required/>
                        <datalist id="datalistOptions" style={{}}>
                            <option value="Admin"/>
                            <option value="Student"/>
                            <option value="TA"/>
                        </datalist>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="lms_idLabel">Lms_ID</label>
                        <input type="text" id="lms_id" name="newLMS_ID" className="m-1 fs-6" style={{}} required/>
                    </div>
                   
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="owner_idLabel">Owner_ID</label>
                        <input type="text" id="owner_id" name="newOwner_ID" className="m-1 fs-6" style={{}} required/>
                    </div> 
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="consentLabel">Consent</label>
                        <input type="checkbox" id="consent" name="newConsent" className="m-1 fs-6" style={{}} required/>
                    </div>
                </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;