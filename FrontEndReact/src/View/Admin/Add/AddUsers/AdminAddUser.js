import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import ResponsiveDialog from '../../../Components/DropConfirmation.js';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import { Box, Button, FormControl, Typography, TextField, MenuItem, InputLabel, Select} from '@mui/material';
import Cookies from 'universal-cookie';



class AdminAddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: "",
            editUser: false,
            showDialog: false,

            firstName: '',
            lastName: '',
            email: '',
            role: '',
            lmsId: '',

            errors: {
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                lmsId: '',
            }
        }

        this.unenrollUser = () => {
            var navbar = this.props.navbar;

            genericResourcePUT(
                `/user?uid=${navbar.state.user["user_id"]}&course_id=${navbar.state.chosenCourse["course_id"]}`,
                this,
                {
                    userId: navbar.state.user["user_id"],
                    courseId: navbar.state.chosenCourse["course_id"]
                }
            );

            navbar.confirmCreateResource("User");
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;

        if(user!==null && !addUser) {
            this.setState({
                firstName: user["first_name"],
                lastName: user["last_name"],
                email: user["email"],
                role: user["role_id"],
                lmsId: user["lms_id"],
                editUser: true,
            });
        }
    }


    handleDialog = () => {
        this.setState({
            showDialog: this.state.showDialog === false ? true : false,
        })
    }

    handleChange = (e) => {
        const { id, value, name } = e.target;

        this.setState({
          [id]: value,
          errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be empty` : '',
          },
        });
    };

    handleSelect = (event) => {
        this.setState({
            role: event.target.value,
        })
      };

    handleSubmit = () => {
        const {
            firstName,
            lastName,
            email,
            role,
            lmsId,
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;
        var confirmCreateResource = navbar.confirmCreateResource;
        var chosenCourse = state.chosenCourse;

        if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === ''|| (!navbar.props.isSuperAdmin && role === '')) {

            this.setState({
                errors: {
                    firstName: firstName.trim() === '' ? 'First Name cannot be empty' : '',
                    lastName: lastName.trim() === '' ? 'Last Name cannot be empty' : '',
                    email: email.trim() === '' ? ' Email cannot be empty' : '',
                },
            });

        } else if (!validator.isEmail(email)) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    email: 'Please enter a valid email address',
                },
            });

        } else {
            const cookies = new Cookies();

            var body = JSON.stringify({
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "lms_id": lmsId,
                "consent": null,
                "owner_id": cookies.get('user')['user_id'],
                "role_id": navbar.props.isSuperAdmin ? 3 : role
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

            confirmCreateResource("User");
        }
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
                    <ResponsiveDialog
                    show={this.state.showDialog}
                    handleDialog={this.handleDialog}
                    userFirstName={this.state.firstName}
                    userLastName={this.state.lastName}
                    dropUser={this.unenrollUser} />

                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                                    <Typography id="addCourseTitle" variant="h5"> {editUser ? "Edit User" : "Add User"} </Typography>

                                    { !navbar.props.isSuperAdmin && state.user !== null && state.addUser === false &&
                                        <Box>
                                            <Button id="dropUserButton" onClick={ this.handleDialog }>
                                                Drop User
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
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                    />

                                    <TextField
                                        id="lastName"
                                        name="Last Name"
                                        variant='outlined'
                                        label="Last Name"
                                        fullWidth
                                        value={lastName}
                                        error={!!errors.lastName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                    />

                                    <TextField
                                        id="email" 
                                        name="Email"
                                        variant='outlined'
                                        label="Email Address"
                                        fullWidth
                                        value={email}
                                        error={!!errors.email}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 3}}
                                    />

                                    { !navbar.props.isSuperAdmin &&
                                        <FormControl fullWidth>
                                            <InputLabel id="Role">Role</InputLabel>

                                            <Select
                                                labelId="Role"
                                                id="role"
                                                value={role}
                                                label="Role"
                                                defaultValue="test"
                                                error={!!errors.role}
                                                onChange={this.handleSelect}
                                                required
                                                sx={{mb: 3}}
                                            >

                                            <MenuItem value={5}>Student</MenuItem>

                                            <MenuItem value={4}>TA/Instructor</MenuItem>

                                            <MenuItem value={"Admin"}>Admin</MenuItem>
                                            </Select>
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
                                        onChange={this.handleChange}
                                        sx={{mb: 3}}
                                    />

                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                        <Button onClick={() => { confirmCreateResource("User"); }} id="" className="">
                                            Cancel
                                        </Button>

                                        <Button onClick={this.handleSubmit} id="createUser" className="primary-color" variant="contained">
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
