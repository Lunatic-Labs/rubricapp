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
            validMessage: "",
            editUser: false
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/role")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({roles: result["content"]["roles"]});
            }
        )
        const { users, user_id } = this.props;
        if(users!==null && user_id!==null) {
            for(var u = 0; u < users.length; u++) {
                if(users[u]["user_id"]===user_id) {
                    document.getElementById("firstName").value = users[u]["first_name"];
                    document.getElementById("lastName").value = users[u]["last_name"];
                    document.getElementById("email").value = users[u]["email"];
                    document.getElementById("password").setAttribute("disabled", true);
                    document.getElementById("role").value = users[u]["role_id"];
                    document.getElementById("lms_id").value = users[u]["lms_id"];
                    document.getElementById("addUserTitle").innerText = "Edit User";
                    document.getElementById("createButton").innerText = "EDIT USER";
                    this.setState({editUser: true});
                }
            }
        }
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
            if(this.props.addUser) {
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
                if(role===-1) {
                    console.log("Invalid Role!");
                    this.setState({valid: false, validMessage: "Invalid Form: Invalid Role!"});
                } else {
                    var lms_id = document.getElementById("lms_id").value;
                    var apiEndPoint = "http://127.0.0.1:5000/api/user";
                    var method = "POST";
                    if(!this.props.addUser) {
                        apiEndPoint = `http://127.0.0.1:5000/api/user/${user_id}`;
                        method = "PUT";
                    }
                    fetch( apiEndPoint,
                        {
                            method: method,
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
                }
            } else {
                setTimeout(() => {
                    this.setState({validMessage: ""});
                }, 2000);
            }
            setTimeout(() => {
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    componentDidUpdate() {
        if(this.state.editUser && this.state.roles) {
            var role = document.getElementById("role");
            var role_id = role.value;
            if(role_id > 0) {
                var role_name = this.state.roles[0][role_id-1]["role_name"];
                role.value = role_name;
            }
        }
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
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">{ validMessage }</h1>
                    </React.Fragment>
                }
                <div id="outside">
                    <h1 id="addUserTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add User</h1>
                    <div className="d-flex justify-content-around">Please add a new user or edit the current user</div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}><label id="firstNameLabel">First Name</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}><input type="text" id="firstName" name="newFirstName" className="m-1 fs-6" style={{maxWidth:"100%"}} placeholder="First Name" required/></div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between"><label id="lastNameLabel">Last Name</label></div>
                            <div className="w-75 p-2 justify-content-around "><input type="text" id="lastName" name="newLastName" className="m-1 fs-6" style={{}} placeholder="Last Name" required/></div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between"><label id="emailLabel">Email</label></div>
                            <div className="w-75 p-2 justify-content-around"><input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{}} placeholder="example@email.com" required/></div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between"><label id="passwordLabel">Password</label></div>
                            <div className="w-75 p-2 justify-content-between"><input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{}} placeholder="(must include letters and numbers)" required/></div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-around"><label htmlFor="exampleDataList" className="form-label">Role</label></div>
                            <div className="w-75 p-2 justify-content-around"><input type="text" id="role" name="newRole" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Student" required/>
                                <datalist id="datalistOptions" style={{}}>
                                    {allRoles}
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-around"> <label id="lms_idLabel">Lms ID</label></div>
                            <div className="w-75 p-2 justify-content-around"><input type="text" id="lms_id" name="newLMS_ID" className="m-1 fs-6" style={{}} placeholder="e.g. 12345"/></div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;