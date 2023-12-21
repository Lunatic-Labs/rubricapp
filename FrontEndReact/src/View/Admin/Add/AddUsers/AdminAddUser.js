import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';
import { Box, Button, FormControl, Typography, TextField, MenuItem, InputLabel, Select} from '@mui/material';
import Cookies from 'universal-cookie';

class AdminAddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editUser: false,

            firstName: '',
            lastName: '',
            email: '',
            role: '',
            lms_id: '',

            errors: {
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                lms_id: '',
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
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;

        if(user!==null && !addUser) {
            const {
                first_name,
                last_name,
                email,
                role_id,
                lms_id,
            } = user;

            this.setState({
                firstName: first_name,
                lastName: last_name,
                email: email,
                role: role_id,
                lms_id: lms_id,
                editUser: true,
            });
        }
    }


    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState({
          [id]: value,
          errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
          },
        });
    };

    handleSelect = (event) => {
        this.setState({
            role: event.target.value,
        })
      };

    handleSubmit = () => {
        // TODO: Handle IsSuperAdmin Logic!!!
        const {
            firstName,
            lastName,
            email,
            role,
            lms_id,
        } = this.state;
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;
        // var admin_id = state.user_id;
        var confirmCreateResource = navbar.confirmCreateResource;
        var chosenCourse = state.chosenCourse;

        // Your validation logic here
        if (firstName.trim() === '' || lastName.trim() === '' || email.trim() === ''|| role === '') {
            // Handle validation error
            console.error('Validation error: Fields cannot be empty');
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
                "lms_id": lms_id, 
                "consent": null, 
                "owner_id": cookies.get('user')['user_id'], 
                "role_id": role
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
            error,
            errors,
            errorMessage,
            validMessage,
            firstName,
            lastName,
            email,
            role,
            lms_id,
            editUser
        } = this.state;
       
        var navbar = this.props.navbar;
        var state = navbar.state;
        var confirmCreateResource = navbar.confirmCreateResource;
        var addUser = state.addUser;

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
            <Box className="card-spacing">
                <Box className="form-position">
                    <Box className="card-style">
                        <FormControl className="form-spacing">
                            <Typography id="addCourseTitle" variant="h5"> {editUser ? "Edit User" : "Add User"} </Typography>
                            <Box className="form-input">
                                <TextField
                                    id="firstName" 
                                    name="newFirstName"
                                    variant='outlined'
                                    label="First Name"
                                    fullWidth
                                    value={firstName}
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    onChange={this.handleChange}
                                    required
                                    sx={{mb: 3}}
                                />
                                <TextField
                                    id="lastName" 
                                    name="newLastName"
                                    variant='outlined'
                                    label="Last Name"
                                    fullWidth
                                    value={lastName}
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    onChange={this.handleChange}
                                    required
                                    sx={{mb: 3}}
                                />
                                <TextField
                                    id="email" 
                                    name="newEmail"
                                    variant='outlined'
                                    label="Email Address"
                                    fullWidth
                                    value={email}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    onChange={this.handleChange}
                                    required
                                    sx={{mb: 3}}
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="Role">Role</InputLabel>
                                    <Select
                                    labelId="Role"
                                    id="role"
                                    value={role}
                                    label="Role"
                                    defaultValue="test"
                                    error={!!errors.role}
                                    helperText={errors.role}
                                    onChange={this.handleSelect}
                                    required
                                    sx={{mb: 3}}
                                    >
                                    
                                    <MenuItem value={5}>Student</MenuItem>
                                    <MenuItem value={4}>TA/Instructor</MenuItem>
                                    <MenuItem value={"Admin"}>Admin</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    id="lms" 
                                    name="newLmsID"
                                    variant='outlined'
                                    label="LMS ID (Optional)"
                                    fullWidth
                                    value={lms_id}
                                    error={!!errors.lms_id}
                                    helperText={errors.lms_id}
                                    onChange={this.handleChange}
                                    sx={{mb: 3}}
                                />
                                <Box sx={{display:"flex", justifyContent:"space-between", alignItems:"center", gap: "20px"}}>
                                    <Box>
                                        <Button id="dropUserButton"
                                            className="primary-color"
                                            variant="contained"
                                            onClick={() =>{
                                                this.unenrollUser();
                                            }}
                                        >
                                            Drop User
                                        </Button>
                                    </Box>
                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>

                                        <Button onClick={() => {
                                            confirmCreateResource("User")
                                        }}
                                        id="" className="">   
                                            Cancel
                                        </Button>

                                        <Button onClick={this.handleSubmit} id="createUser" className="primary-color"
                                            variant="contained"
                                        >   
                                            {editUser ? "Update User" : "Add User"}
                                        </Button>
                                    </Box>
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