import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';

class AdminAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editUser: false
        }
        this.unenrollUser = () => {
            var navbar = this.props.navbar;
            var data = {
                userId: navbar.state.user["user_id"],
                courseId: navbar.state.chosenCourse["course_id"]
            }

            fetch(API_URL + `/userCourse/disable/${navbar.state.user["user_id"]}/${navbar.state.chosenCourse["course_id"]}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            })
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;
        var adminViewUsers = navbar.adminViewUsers;
        var role_names = adminViewUsers.role_names;
        var chosenCourse = state.chosenCourse;

        if (user !== null) {
            document.getElementById("firstName").value = user["first_name"];
            document.getElementById("lastName").value = user["last_name"];
            document.getElementById("email").value = user["email"];

            if (!navbar.props.isSuperAdmin) {
                document.getElementById("role_id").value = user["role_id"];
                document.getElementById("role").value = role_names[user["role_id"]];
            }

            document.getElementById("lms_id").value = user["lms_id"];
            document.getElementById("addUserTitle").innerText = "Edit User";
            document.getElementById("addUserDescription").innerText = "Please Edit the current User";
            document.getElementById("createUser").innerText = "Save";
            this.setState({editUser: true});
        }
        document.getElementById("createUser").addEventListener("click", () => {
            var message = "Invalid Form: ";
            var success = true;

            if (success && validator.isEmpty(document.getElementById("firstName").value)) {
                success = false;
                message += "Missing First Name!";
            } else if(success && validator.isEmpty(document.getElementById("lastName").value)){
                success = false;
                message += "Missing Last Name!";
            } else if (success && validator.isEmpty(document.getElementById("email").value)) {
                success = false;
                message += "Missing Email!";
            } else if(success && !validator.isEmail(document.getElementById("email").value)) {
                document.getElementById("email").placeholder="Please enter a valid email";
                success = false;
                message += "Invalid Email!";
            } else if (success && !navbar.props.isSuperAdmin && addUser && validator.isEmpty(document.getElementById("password").value)) {
                success = false;
                message += "Missing Password!";
            } else if (success && !navbar.props.isSuperAdmin && addUser && Object.keys(document.getElementById("password").value).length <= 7) {
                document.getElementById("password").placeholder="Minimum of 8 characters required";
                success = false;
                message = "Invalid Password!";
            } else if(success && !navbar.props.isSuperAdmin && addUser && !validator.isAlphanumeric(document.getElementById("password").value)){
                document.getElementById("password").placeholder = "At least one digit";
                success = false;
                message += "Invalid Password!";
            } else if (success && !navbar.props.isSuperAdmin && validator.isEmpty(document.getElementById("role").value)) {
                success = false;
                message += "Missing Role!";
            } else if (success && !navbar.props.isSuperAdmin && !Object.values(role_names).includes(document.getElementById("role").value)) {
                success = false;
                message += "Invalid Role!";
            } else if (success && !navbar.props.isSuperAdmin && document.getElementById("role").value==="Researcher") {
                success = false;
                message += "Invalid Role!";
            } else if (success && !navbar.props.isSuperAdmin && document.getElementById("role").value==="SuperAdmin") {
                success = false;
                message += "Invalid Role!";
            } else if (success && !navbar.props.isSuperAdmin && document.getElementById("role").value==="Admin") {
                success = false;
                message += "Invalid Role!";
            } else if (success && !navbar.props.isSuperAdmin && state.isAdmin && !chosenCourse["use_tas"] && document.getElementById("role").value==="TA/Instructor") {
                success = false;
                message += "Invalid Role!";
            }

			if(success) {
                Object.keys(role_names).map((role_id) => {
                    if(!navbar.props.isSuperAdmin && role_names[role_id] === document.getElementById("role").value) {
                        document.getElementById("role_id").value = role_id;
                    }

                    return role_id;
                });

                let body = JSON.stringify({
                    "first_name": document.getElementById("firstName").value,
                    "last_name": document.getElementById("lastName").value,
                    "email": document.getElementById("email").value,
                    "role_id": navbar.props.isSuperAdmin ? 3 : document.getElementById("role_id").value,
                    "lms_id": document.getElementById("lms_id").value,
                    "consent": null,
                    "owner_id": 1
                });

                if(user === null && addUser === false) {
                    if(navbar.props.isSuperAdmin) {
                        genericResourcePOST(`/user`, this, body);
                    } else {
                        genericResourcePOST(`/user?course_id=${chosenCourse["course_id"]}`, this, body);
                    }
                } else if (user === null && addUser === true && navbar.props.isSuperAdmin) {
                    genericResourcePOST(`/user`, this, body);
                } else {
                    genericResourcePUT(`/user?uid=${user["user_id"]}`, this, body);
                }

            } else {
                document.getElementById("createUser").classList.add("pe-none");
                document.getElementById("createUserCancel").classList.add("pe-none");
                document.getElementById("createUserClear").classList.add("pe-none");

                this.setState({validMessage: message});

                setTimeout(() => {
                    document.getElementById("createUser").classList.remove("pe-none");
                    document.getElementById("createUserCancel").classList.remove("pe-none");
                    document.getElementById("createUserClear").classList.remove("pe-none");

                    this.setState({validMessage: ""});
                }, 2000);
            }

            setTimeout(() => {
                if(document.getElementsByClassName("alert-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        var allRoles = [];
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var addUser = state.addUser;
        var adminViewUsers = navbar.adminViewUsers;
        var roles = adminViewUsers.roles;

        if(roles) {
            for(var r = 0; r < roles.length; r++) {
                if(
                    (
                        chosenCourse["use_tas"] &&
                        roles[r]["role_name"]==="TA/Instructor"
                    ) ||
                    roles[r]["role_name"]==="Student"
                ) {
                    allRoles = [...allRoles, <option value={roles[r]["role_name"]} key={r}/>];
                }
            }
        }

        const {
            error,
            errorMessage,
            validMessage
        } = this.state;
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={addUser}
                        resource={"User"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={addUser}
                        resource={"User"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={addUser}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="addUserTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add User</h1>
                    <div id="addUserDescription" className="d-flex justify-content-around">Please add a new user</div>
                    <form>
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
                                <div className="w-75 p-2 justify-content-around"><input type="email" id="email" name="newEmail" className="m-1 fs-6" style={{}} placeholder="example@email.com" autoComplete='username' required/></div>
                            </div>
                        </div>
                        {!navbar.props.isSuperAdmin &&
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="w-25 p-2 justify-content-around">
                                        <label className="form-label">Role</label>
                                    </div>
                                        <div className="w-75 p-2 justify-content-around">
                                            <input id="role_id" className='d-none'/>
                                            <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder={navbar.props.isSuperAdmin ? "Admin": "e.g. Student"} required/>
                                            <datalist id="datalistOptions" style={{}}>
                                                <>
                                                    <option value={"TA/Instructor"} key={4} />,
                                                    <option value={"Student"} key={5} />
                                                </>
                                            </datalist>
                                        </div>
                                </div>
                            </div>
                        }
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-around"> <label id="lms_idLabel">Lms ID</label></div>
                                <div className="w-75 p-2 justify-content-around"><input type="text" id="lms_id" name="newLMS_ID" className="m-1 fs-6" style={{}} placeholder="e.g. 12345 OPTIONAL"/></div>
                            </div>
                        </div>
                    </form>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <button id="dropUserButton" className='btn btn-primary'onClick={() =>{this.unenrollUser()}}>Drop User</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;
