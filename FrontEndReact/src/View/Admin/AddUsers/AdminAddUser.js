// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import './addStyles.css';

// class AdminAddUser extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             error: null,
//             errorMessage: null,
//         }
//     }
//     componentDidMount() {
//         var createButton = document.getElementById("createButton");
//         createButton.addEventListener("click", () => {
//             var firstName = document.getElementById("firstName").value;
//             var lastName = document.getElementById("lastName").value;
//             var email = document.getElementById("email").value;
//             var password = document.getElementById("password").value;
//             var role = document.getElementById("role").value;
//             var lms_id = document.getElementById("lms_id").value;
//             var consent = document.getElementById("consent").value==="on";
//             var owner_id = document.getElementById("owner_id").value;
//             fetch( "http://127.0.0.1:5000/api/user",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json"
//                     },
//                     body: JSON.stringify({
//                         "first_name": firstName,
//                         "last_name": lastName,
//                         "email": email,
//                         "password": password,
//                         "role": role,
//                         "lms_id": lms_id,
//                         "consent": consent,
//                         "owner_id": owner_id
//                 })
//             })
//             .then(res => res.json())
//             .then(
//                 (result) => {
//                     if(result["success"] === false) {
//                         this.setState({
//                             errorMessage: result["message"]
//                         })
//                     }
//                 },
//                 (error) => {
//                     this.setState({
//                         error: error
//                     })
//                 }
//             )
//         });
//     }
//     render() {
//         const { error , errorMessage} = this.state;
//         return (
//             <React.Fragment>
//                 { error &&
//                         <React.Fragment>
//                             <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { error.message }</h1>
//                         </React.Fragment>
//                 }
//                 { errorMessage &&
//                         <React.Fragment>
//                             <h1 className="text-danger text-center p-3">Creating a new users resulted in an error: { errorMessage }</h1>
//                         </React.Fragment>
//                 }
//                 <div id='outside' className="mt-5">
//                 <h1 className="text-center mt-5">Add New User</h1>
//                 <div className="d-flex flex-column p-2 m-4"> 
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="firstNameLabel">First Name</label>
//                         <input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" required/>
//                     </div>
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="lastNameLabel">Last Name</label>
//                         <input type="text" id="lastName" name="newLastName" className="m-1 fs-6" required/>
//                     </div>
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="emailLabel">Email</label>
//                         <input type="email" id="email" name="newEmail" className="m-1 fs-6" placeholder="example@email.com" required/>
//                     </div>
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="passwordLabel">Password</label>
//                         <input type="password" id="password" name="newPassword" className="m-1 fs-6" required/>
//                     </div>
//                     <div className="col d-flex justify-content-center m-1" style={{"heifht":"3rem"}}>
//                         <label htmlFor="exampleDataList" className="form-label">Role</label>
//                         <input type="text" id="role" name="newRole" className="m-1 fs-6" list="datalistOptions" required/>
//                         <datalist id="datalistOptions">
//                             <option value="Admin"/>
//                             <option value="Student"/>
//                             <option value="TA"/>
//                         </datalist>
//                     </div>
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="lms_idLabel">Lms_ID</label>
//                         <input type="text" id="lms_id" name="newLMS_ID" className="m-1 fs-6" required/>
//                     </div>
                   
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="owner_idLabel">Owner_ID</label>
//                         <input type="text" id="owner_id" name="newOwner_ID" className="m-1 fs-6" required/>
//                     </div> 
//                     <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
//                         <label id="consentLabel">Consent</label>
//                         <input type="checkbox" id="consent" name="newConsent" className="m-1 fs-6" required/>
//                     </div>
//                 </div>
//                 </div>
//             </React.Fragment>
//         )
//     }
// }

// export default AdminAddUser;

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './addStyles.css';

class AdminAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            roles: null,
            valid: false,
            validMessage: ""
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/role")
        .then(res => res.json())
        .then((result) => {
            this.setState({roles: result["content"]["roles"]});
        });
        var createButton = document.getElementById("createButton");
        createButton.addEventListener("click", () => {
            //form validation for Add User
            let isValid = true;
            var firstNameIsValid = document.getElementById("firstName");
            var lastNameIsValid = document.getElementById("lastName");
            var emailIsValid = document.getElementById("email");
            var passwordIsValid = document.getElementById("password");
            var roleIsValid = document.getElementById("role");
            var lms_idIsValid = document.getElementById("lms_id");
            var continueValidating = true;
            if (firstNameIsValid.value==="" && continueValidating) {
                firstNameIsValid.placeholder="This field is required.";
                firstNameIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing First Name!"});
            }
            // validate the last name entry
            if(lastNameIsValid.value==="" && continueValidating){
                lastNameIsValid.placeholder="This field is required.";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing Last Name!"});
            }
            //lms id validation was told this is now not required
            if (lms_idIsValid.value==="" && continueValidating) {
                lms_idIsValid.placeholder="This field is required.";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing LMS ID!"});
            }
            // else if (isNaN(lms_id.value)) {
            //     lms_id.placeholder="Use 99999 format.";
            //     //console.log(lms_id.value)
            //     lms_id.value="";
            //     isValid = false;
            // } 
            // else if (Object.keys(lms_id.value).length !== 5 ) {
            //     lms_id.placeholder="Use 5-digit code.";
            //     //console.log(lms_id.value)
            //     lms_id.value="";
            //     isValid = false;
            // }
            // else{
            //     console.log("LMS Good")
            // }
            //validate email
            const emailPattern =
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
            if (emailIsValid.value==="" && continueValidating) {
                emailIsValid.placeholder="This field is required.";
                emailIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing Email!"});
            } else if(!(!this.state.emailIsValid || emailPattern.test(this.state.emailIsValid) === false) && continueValidating){
                emailIsValid.placeholder="Please enter a valid email";
                emailIsValid.value="";
                isValid=false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Invalid Email!"});
            }
            //validate password
            // const letter = /(?=.*?[a-z])/;
            const digitsRegExp = /(?=.*?[0-9])/;
            const digitsPassword = digitsRegExp.test(passwordIsValid.value);
            if (passwordIsValid.value==="" && continueValidating) {
                passwordIsValid.placeholder="This field is required.";
                passwordIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing Password!"});
            } else if (Object.keys(passwordIsValid.value).length <= 7 && continueValidating) {
                passwordIsValid.placeholder="Minimum of 8 characters required";
                passwordIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Invalid Password!"});
            } else if(!digitsPassword && continueValidating){
                passwordIsValid.placeholder="At least one digit"
                passwordIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Invalid Password!"});
            }
            if (roleIsValid.value==="" && continueValidating) {
                roleIsValid.placeholder="This field is required.";
                roleIsValid.value="";
                isValid = false;
                continueValidating = false;
                this.setState({validMessage: "Invalid Form: Missing Role!"});
            }
            if(isValid) {
                this.setState({valid: true});
                var firstName = document.getElementById("firstName").value;
                var lastName = document.getElementById("lastName").value;
                var email = document.getElementById("email").value;
                var password = document.getElementById("password").value;
                var role = document.getElementById("role").value;
                var roleID = -1;
                for(var i = 0; i < this.state.roles[0].length; i++) {
                    if(this.state.roles[0][i]["role_name"]===role) {
                        roleID = this.state.roles[0][i]["role_id"];
                    }
                }
                role = roleID;
                var lms_id = document.getElementById("lms_id").value;
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
                            "role_id": role,
                            "lms_id": lms_id,
                            "consent": null,
                            "owner_id": 1
                        })
                    }
                )
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
            } else {
                setTimeout(() => {
                    this.setState({validMessage: ""});
                }, 2000);
            }
            setTimeout(() => {
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        const { error , errorMessage, roles, valid, validMessage} = this.state;
        var allRoles = [];
        if(roles) {
            for(var i = 0; i < roles[0].length; i++) {
                allRoles = [...allRoles, <option value={roles[0][i]["role_name"]} key={i}/>];
            }
        }
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
                { !valid && validMessage!=="" &&
                    <>
                        <h1 className="text-danger text-center p-3">{ validMessage }</h1>
                    </>
                }
                <div id='outside' className="mt-5">
                <h1 className="text-center mt-5">Add New User</h1>
                <div className="d-flex flex-column p-2 m-4"> 
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="firstNameLabel">First Name</label>
                        <input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{}} placeholder="First Name" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="lastNameLabel">Last Name</label>
                        <input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{}} placeholder="Last Name" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="emailLabel">Email</label>
                        <input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{}} placeholder="example@email.com" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="passwordLabel">Password</label>
                        <input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{}} placeholder="(must include letters and numbers)" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"heifht":"3rem"}}>
                        <label htmlFor="exampleDataList" className="form-label">Role</label>
                        <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Student" required/>
                        <datalist id="datalistOptions" style={{}}>
                            {allRoles}
                        </datalist>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="lms_idLabel">Lms ID</label>
                        <input type="text" id="lms_id" name="newLMS_ID" className="m-1 fs-6" style={{}} placeholder="e.g. 12345"/>
                    </div>
                </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;