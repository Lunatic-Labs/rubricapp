import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import DropConfirmation from '../../../Components/DropConfirmation.js';
import DeleteConfirmation from '../../../Components/DeleteConfirmation.js';
import { genericResourceDELETE, genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import { Box, Button, FormControl, Typography, TextField, MenuItem, InputLabel, Select} from '@mui/material';
import Cookies from 'universal-cookie';
import FormHelperText from '@mui/material/FormHelperText';



class AdminAddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: "",
            editUser: false,
            showDialog: false,
            mode: "",

            firstName: '',
            lastName: '',
            email: '',
            originalEmail: '',
            role: '',
            lmsId: '',

            errors: {
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                lmsId: '',
            }
        };

        this.unenrollUser = () => {
            var navbar = this.props.navbar;

            genericResourcePUT(
                `/user?uid=${navbar.state.user["user_id"]}&course_id=${navbar.state.chosenCourse["course_id"]}&unenroll_user=${true}`,
                this,
                {
                    userId: navbar.state.user["user_id"],
                    courseId: navbar.state.chosenCourse["course_id"]
                }
            ).then(result => {
                if (result !== undefined && result.errorMessage === null) {
                navbar.confirmCreateResource("User");
                }
            });
        }

        this.deleteUser = () => {
            var navbar = this.props.navbar;

            genericResourceDELETE(
                `/user?uid=${navbar.state.user["user_id"]}`,
                this
            );

            navbar.confirmCreateResource("User");
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;

        if (user !== null && !addUser) {
            this.setState({
                firstName: user["first_name"],
                lastName: user["last_name"],
                email: user["email"],
                originalEmail: user["email"],
                role: user["role_id"],
                lmsId: user["lms_id"],
                editUser: true,
            });
        }
    }

    handleDialog = () => {
        this.setState({
            mode : "",
            showDialog: this.state.showDialog === false ? true : false,
        })
    }

    handleDrop = () => {
        this.handleDialog();
        this.setState({
            mode: "drop",
        })
    }

    handleDelete = () => {
        this.handleDialog();
        this.setState({
            mode: "delete",
        })
    }

    handleChange = (e) => {
        const { id, value } = e.target;

        var formatString = "";

        for (let i = 0; i < id.length; i++) {
            if (i === 0) {
                formatString += id.charAt(0).toUpperCase();
            } else if (id.charAt(i) === id.charAt(i).toUpperCase()) {
                formatString += (" " + id.charAt(i).toLowerCase()); 
            } else {
                formatString += id.charAt(i);
            }
        }

        this.setState({
          [id]: value,
          errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${formatString} cannot be empty` : '',
          },
        });
    };

    handleSelect = (event) => {
        this.setState({
            role: event.target.value
        });
      };

    handleSubmit = () => {
        const {
            firstName,
            lastName,
            email,
            originalEmail,
            role,
            lmsId,
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;
        var confirmCreateResource = navbar.confirmCreateResource;
        var chosenCourse = state.chosenCourse;

        var newErrors = {
            "firstName": "",
            "lastName": "",
            "email": "",
            "role": ""
        };

        if (firstName.trim() === '')
            newErrors["firstName"] = "First name cannot be empty";

        if (lastName.trim() === '')
            newErrors["lastName"] = "Last name cannot be empty";

        if (email.trim() === '')
            newErrors["email"] = "Email cannot be empty";

        if (!navbar.props.isSuperAdmin && role === '')
            newErrors["role"] = "Role cannot be empty";

        if (!validator.isEmail(email) && newErrors["email"] === '')
            newErrors["email"] = "Please enter a valid email address";

        if (newErrors["firstName"] !== '' || newErrors["lastName"] !== '' || newErrors["email"] !== '' || newErrors["role"] !== '') {
            this.setState({
                errors: newErrors
            });

            return;
        }

        const cookies = new Cookies();

        var body = JSON.stringify({
            "first_name": firstName,
            "last_name": lastName,
            "email": email,
            "lms_id": lmsId !== "" ? lmsId : null,
            "consent": null,
            "owner_id": cookies.get('user')['user_id'],
            "role_id": navbar.props.isSuperAdmin ? 3 : role
        });

        let promise;
        let owner_id = cookies.get('user')['user_id'];

        if(user === null && addUser === false) {
            if(navbar.props.isSuperAdmin) {
                promise = genericResourcePOST(`/user`, this, body);
            } else {
                promise = genericResourcePOST(`/user?course_id=${chosenCourse["course_id"]}&owner_id=${owner_id}`, this, body);
            }

        } else if (user === null && addUser === true && navbar.props.isSuperAdmin) {
            promise = genericResourcePOST(`/user`, this, body);
        } else if (user !== null && addUser === false && navbar.props.isSuperAdmin) {
            promise = genericResourcePUT(`/user?uid=${user["user_id"]}`, this, body);
        } else {
            promise = (email !== originalEmail)

                // The email has been updated, pass the new email
                ? genericResourcePUT(`/user?uid=${user["user_id"]}&course_id=${chosenCourse["course_id"]}&new_email=${email}&owner_id=${owner_id}`, this, body)

                // The email has not been updated, no need to pass the new email
                : genericResourcePUT(`/user?uid=${user["user_id"]}&course_id=${chosenCourse["course_id"]}`, this, body);
        }

        promise.then(result => {
            if (result !== undefined && result.errorMessage === null) {
                confirmCreateResource("User");
            }
        });
    }

    hasErrors = () => {
        const { errors } = this.state;

        return Object.values(errors).some((error) => !!error);
    };

    render() {
        const {
            errors,
            errorMessage,
            validMessage,
            firstName,
            lastName,
            email,
            role,
            lmsId,
            editUser
        } = this.state;
       
        var navbar = this.props.navbar;
        var state = navbar.state;
        var confirmCreateResource = navbar.confirmCreateResource;
        var addUser = state.addUser;
        return (
            <React.Fragment>
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

                <Box className="card-spacing">
                    <DropConfirmation
                        show={this.state.mode === "drop" ? true : false}

                        handleDialog={this.handleDialog}

                        userFirstName={this.state.firstName}

                        userLastName={this.state.lastName}

                        dropUser={this.unenrollUser}
                    />
                    <DeleteConfirmation
                        show={this.state.mode === "delete" ? true : false}

                        handleDialog={this.handleDialog}

                        userFirstName={this.state.firstName}

                        userLastName={this.state.lastName}

                        deleteUser={this.deleteUser}
                    />

                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing" aria-label="addUserForm">
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                                    <Typography id="addCourseTitle" variant="h5" aria-label={this.state.editUser ? 'editUserTitle' : 'addUserTitle'}> 
                                    {editUser ? "Edit User" : "Add User"} </Typography>

                                    { !navbar.props.isSuperAdmin && state.user !== null && state.addUser === false &&
                                        <Box>
                                            <Button id="dropUserButton" onClick={ this.handleDrop } aria-label="dropUserButton">
                                                Drop User
                                            </Button>
                                        </Box>
                                    }
                                    { navbar.props.isSuperAdmin && state.user !== null && state.addUser === false &&
                                        <Box>
                                            <Button id="deleteUserButton" onClick={ this.handleDelete }>
                                                Delete User
                                            </Button>
                                        </Box>
                                    }
                                </Box>

                                <Box className="form-input">
                                    <TextField
                                        id="firstName"
                                        name="First Name"
                                        variant='outlined'
                                        label="First Name"
                                        fullWidth
                                        value={firstName}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                        aria-label="userFirstNameInput"
                                    />

                                    <TextField
                                        id="lastName"
                                        name="Last Name"
                                        variant='outlined'
                                        label="Last Name"
                                        fullWidth
                                        value={lastName}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                        aria-label="userLastNameInput"
                                    />

                                    <TextField
                                        id="email" 
                                        name="Email"
                                        variant='outlined'
                                        label="Email Address"
                                        fullWidth
                                        value={email}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                        aria-label="userEmailAddressInput"
                                    />

                                    { !navbar.props.isSuperAdmin &&
                                        <FormControl error={!!errors.role} required fullWidth sx={{mb: 3}}>
                                            <InputLabel className={errors.role ? "errorSelect" : ""} >Role</InputLabel>

                                            <Select
                                                labelId="Role"
                                                id="role"
                                                value={role}
                                                label="Role"
                                                defaultValue="test"
                                                error={!!errors.role}
                                                onChange={this.handleSelect}
                                                required
                                                aria-label="addUserRoleDropDown"
                                            >
                                                <MenuItem value={5} aria-label="addUserRoleDropDownStudentOption">Student</MenuItem>

                                                <MenuItem value={4} aria-label="addUserRoleDropDownTAOrInstructorOption">TA/Instructor</MenuItem>

                                                {/* <MenuItem value={3}>Admin</MenuItem> */}
                                            </Select>
                                            <FormHelperText>{errors.role}</FormHelperText>
                                        </FormControl>
                                    }

                                    <TextField
                                        id="lmsId"
                                        name="newLmsID"
                                        variant='outlined'
                                        label="LMS ID (Optional)"
                                        fullWidth
                                        value={lmsId}
                                        error={!!errors.lmsId}
                                        helperText={errors.lmsId}
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                    />
                                    
                                    {/* Color is currently hardcoded */}
                                    <div style={{color:"#2e8bef"}}>
                                        Important: Make sure students check their junk email
                                    </div>

                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                        <Button onClick={() => { confirmCreateResource("User"); }} id="" className="" aria-label="cancelAddUserButton">
                                            Cancel
                                        </Button>

                                        <Button onClick={this.handleSubmit} id="createUser" className="primary-color" variant="contained" aria-label="addOrSaveAddUserButton">
                                            {editUser ? "Update User" : "Add User"}
                                        </Button>
                                    </Box>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default AdminAddUser;
