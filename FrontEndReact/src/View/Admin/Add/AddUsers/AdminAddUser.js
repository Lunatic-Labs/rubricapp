import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import {
  Box,
  Button,
  FormControl,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';

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
    password: '',
    role: '',
    lms_id: '',
    errors: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
    },
  };
}

componentDidMount() {
  const { user } = this.props;

  if (user !== null) {
    const { first_name, last_name, email, role_id, lms_id } = user;

    this.setState({
      firstName: first_name,
      lastName: last_name,
      email: email,
      password: '', // Password is disabled when editing
      role: role_id,
      lms_id: lms_id,
      editUser: true,
    });
  }

  document.getElementById("createUser").addEventListener("click", this.handleButtonClick);
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

handleSubmit = () => {
  const { firstName, lastName, email, password, role, errors } = this.state;

  // Your validation logic here
  if (
    firstName.trim() === '' ||
    lastName.trim() === '' ||
    email.trim() === '' ||
    (this.props.addUser && password.trim() === '') ||
    role.trim() === ''
  ) {
    // Handle validation error
    console.error('Validation error: Fields cannot be empty');
    this.setState({
      errors: {
        firstName: firstName.trim() === '' ? 'First Name cannot be empty' : '',
        lastName: lastName.trim() === '' ? 'Last Name cannot be empty' : '',
        email: email.trim() === '' ? 'Email cannot be empty' : '',
        password: this.props.addUser && password.trim() === '' ? 'Password cannot be empty' : '',
        role: role.trim() === '' ? 'Role cannot be empty' : '',
      },
    });
  } else if (!validator.isEmail(email)) {
    this.setState({
      errors: {
        ...this.state.errors,
        email: 'Invalid Email',
      },
    });
  } else if (this.props.addUser && password.length < 8) {
    this.setState({
      errors: {
        ...this.state.errors,
        password: 'Password should be at least 8 characters',
      },
    });
  } else if (this.props.addUser && !validator.isAlphanumeric(password)) {
    this.setState({
      errors: {
        ...this.state.errors,
        password: 'Password must be alphanumeric',
      },
    });
  } else if (!validator.isIn(role, this.props.role_names)) {
    this.setState({
      errors: {
        ...this.state.errors,
        role: 'Invalid Role',
      },
    });
  } else if (role === 'Researcher' || role === 'SuperAdmin' || role === 'Admin') {
    this.setState({
      errors: {
        ...this.state.errors,
        role: 'Invalid Role',
      },
    });
  } else if (!this.props.chosenCourse['use_tas'] && role === 'TA/Instructor') {
    this.setState({
      errors: {
        ...this.state.errors,
        role: 'Invalid Role',
      },
    });
  } else {
    const roleID = this.props.role_names.indexOf(role);

    fetch(
      this.props.addUser
        ? `${API_URL}/user?course_id=${this.props.chosenCourse["course_id"]}`
        : `${API_URL}/user/${this.props.user["user_id"]}`,
      {
        method: this.props.addUser ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          role_id: roleID,
          lms_id: this.state.lms_id,
          consent: null,
          owner_id: 1,
        }),
      }
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["success"] === false) {
            this.setState({
              errorMessage: result["message"],
            });
          }
        },
        (error) => {
          this.setState({
            error: error,
          });
        }
      );
  }
};

handleButtonClick = () => {
  this.handleSubmit();

  // Additional logic after button click
  // ...
};

componentDidUpdate() {
  const { editUser, role } = this.state;

  if (editUser && this.props.role_names && role < 6 && role > 0) {
    this.setState({
      role: this.props.role_names[role],
    });
  }
}

render() {
    const { error, errorMessage, validMessage, errors, editUser } = this.state;
    return (
        <React.Fragment>
        {error && (
            <ErrorMessage
            add={this.props.addUser}
            resource={"User"}
            errorMessage={error.message}
            />
        )}
        {errorMessage && (
            <ErrorMessage
            add={this.props.addUser}
            resource={"User"}
            errorMessage={errorMessage}
            />
        )}
        {validMessage !== "" && (
            <ErrorMessage add={this.props.addUser} error={validMessage} />
        )}
        <Box className="page-spacing">
            <Box className="form-position">
                <Box className="card-style">
                <FormControl className="form-spacing">
                    <Typography id='addUser' variant='h4'> {editUser ? 'Edit User' : 'Add User'} </Typography>
                    <Box className="form-input">
                    <TextField
                        id="firstName"
                        label="First Name"
                        value={this.state.firstName}
                        onChange={this.handleChange}
                        error={errors.firstName !== ''}
                        helperText={errors.firstName}
                        required
                        sx={{mb: 4}}
                    />
                    <TextField
                        id="lastName"
                        label="Last Name"
                        value={this.state.lastName}
                        onChange={this.handleChange}
                        error={errors.lastName !== ''}
                        helperText={errors.lastName}
                        required
                        sx={{mb: 4}}
                    />
                    <TextField
                        id="email"
                        label="Email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        error={errors.email !== ''}
                        helperText={errors.email}
                        autoComplete="username"
                        required
                        sx={{mb: 4}}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        error={errors.password !== ''}
                        helperText={errors.password}
                        autoComplete="current-password"
                        required={this.props.addUser}
                        disabled={this.props.addUser}
                        sx={{mb: 4}}
                    />
                    <TextField
                        id="role"
                        label="Role"
                        value={this.state.role}
                        onChange={this.handleChange}
                        error={errors.role !== ''}
                        helperText={errors.role}
                        list="datalistOptions"
                        required
                        sx={{mb: 4}}
                    />
                    <datalist id="datalistOptions" style={{}}>
                        {/* Your options here */}
                    </datalist>
                    <TextField
                        id="lms_id"
                        label="Lms ID"
                        value={this.state.lms_id}
                        onChange={this.handleChange}
                        placeholder="e.g. 12345 OPTIONAL"
                        sx={{mb: 4}}
                    />
                    <FormControlLabel
                        control={<Checkbox color="primary" />}
                        label="I agree to the terms and conditions"
                    />
                    <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                        <Button onClick={this.handleButtonClick} id="createCourse" className="primary-color"
                            variant="contained"
                        >   
                            {editUser ? "Save" : "Add Course"}
                        </Button>
                        </Box>
                    {/* <Button id="createUser" variant="contained" onClick={this.handleButtonClick}>
                        {this.state.editUser ? 'Save' : 'Create User'}
                    </Button> */}
                    </Box>
                </FormControl>
                </Box>
            </Box>
        </Box>
        </React.Fragment>
        );
    }
}

export default AdminAddUser;