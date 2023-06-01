import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './addStyles.css';
import validator from "validator";

class AdminAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editUser: false
        }
    }
    componentDidMount() {
        if(this.props.user!==null) {
            document.getElementById("firstName").value = this.props.user["first_name"];
            document.getElementById("lastName").value = this.props.user["last_name"];
            document.getElementById("email").value = this.props.user["email"];
            document.getElementById("password").setAttribute("disabled", true);
            document.getElementById("role").value = this.props.user["role_id"];
            // console.log("ADD____________");
            // console.log(this.props.user["role_id"]);
            // console.log("ADD____________");
            document.getElementById("lms_id").value = this.props.user["lms_id"];
            document.getElementById("addUserTitle").innerText = "Edit User";
            document.getElementById("addUserDescription").innerText = "Please Edit the current User";
            document.getElementById("createUser").innerText = "Edit User";
            this.setState({editUser: true});
        }
        document.getElementById("createUser").addEventListener("click", () => {
            var message = "Invalid Form: ";
            if (validator.isEmpty(document.getElementById("firstName").value)) {
                message += "Missing First Name!";
            } else if(validator.isEmpty(document.getElementById("lastName").value)){
                message += "Missing Last Name!";
            } else if (validator.isEmpty(document.getElementById("email").value)) {
                message += "Missing Email!";
            } else if(!validator.isEmail(document.getElementById("email").value)) {
                document.getElementById("email").placeholder="Please enter a valid email";
                message += "Invalid Email!";
            } else if (this.props.addUser && validator.isEmpty(document.getElementById("password").value)) {
                message += "Missing Password!";
            } else if (this.props.addUser && Object.keys(document.getElementById("password").value).length <= 7) {
                document.getElementById("password").placeholder="Minimum of 8 characters required";
                message = "Invalid Password!";
            } else if(this.props.addUser && !validator.isAlphanumeric(document.getElementById("password").value)){
                document.getElementById("password").placeholder = "At least one digit";
                message += "Invalid Password!";
            } else if (validator.isEmpty(document.getElementById("role").value)) {
                message += "Missing Role!";
            } else if (!validator.isIn(document.getElementById("role").value, this.props.role_names)) {
                message += "Invalid Role!";
            } else if (document.getElementById("role").value==="Researcher") {
                message += "Invalid Role!";
            } else if (document.getElementById("role").value==="SuperAdmin") {
                message += "Invalid Role!";
            } else if (document.getElementById("role").value==="Admin") {
                message += "Invalid Role!";
            } else if (!this.props.chosenCourse["use_tas"] && document.getElementById("role").value==="TA/Instructor") {
                message += "Invalid Role!";
            } else if (validator.isEmpty(document.getElementById("lms_id").value)) {
                message += "Missing LMS ID!";
            }
            if(message==="Invalid Form: ") {
                var roleID = 0;
                for(var r = 0; r < this.props.role_names.length; r++) {
                    if(this.props.role_names[r]===document.getElementById("role").value) {
                        roleID = r;
                    }
                }
                fetch(
                    (
                        this.props.addUser ?
                            `http://127.0.0.1:5000/api/user?course_id=${this.props.chosenCourse["course_id"]}`
                        :
                            `http://127.0.0.1:5000/api/user/${this.props.user["user_id"]}`
                    ),
                    {
                        method: this.props.addUser ? "POST":"PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "first_name": document.getElementById("firstName").value,
                            "last_name": document.getElementById("lastName").value,
                            "email": document.getElementById("email").value,
                            "password": document.getElementById("password").value,
                            "role_id": roleID,
                            "lms_id": document.getElementById("lms_id").value,
                            "consent": null,
                            "owner_id": 1
                        })
                    }
                )
                .then(res => res.json())
                .then((result) => {
                    if(result["success"] === false) {
                        this.setState({
                            errorMessage: result["message"]
                        })
                }},
                (error) => {
                    this.setState({
                        error: error
                    })
                })
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
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    componentDidUpdate() {
        if(
            this.state.editUser &&
            this.props.role_names &&
            document.getElementById("role").value < 6 &&
            document.getElementById("role").value > 0
        ) {
            document.getElementById("role").value = this.props.role_names[document.getElementById("role").value];
        }
    }
    render() {
        const { error , errorMessage, validMessage } = this.state;
        var allRoles = [];
        if(this.props.roles) {
            for(var r = 0; r < this.props.roles.length; r++) {
                if(
                    (
                        this.props.chosenCourse["use_tas"] &&
                        this.props.roles[r]["role_name"]==="TA/Instructor"
                    ) ||
                    this.props.roles[r]["role_name"]==="Student"
                ) {
                    allRoles = [...allRoles, <option value={this.props.roles[r]["role_name"]} key={r}/>];
                }
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
                { validMessage!=="" &&
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">{ validMessage }</h1>
                    </React.Fragment>
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
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between"><label id="passwordLabel">Password</label></div>
                                <div className="w-75 p-2 justify-content-between"><input type="password" id="password" name="newPassword" className="m-1 fs-6" style={{}} placeholder="(must include letters and numbers)" autoComplete='current-password' required/></div>
                            </div>
                        </div>
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-around">
                                    <label className="form-label">Role</label>
                                </div>
                                <div className="w-75 p-2 justify-content-around">
                                    <input type="text" id="role" name="newRole" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Student" required/>
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
                    </form>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;