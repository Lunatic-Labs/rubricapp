import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames } from '../../../../utility';
import { Box } from '@mui/material';

class AdminViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: null,
            roles: null
        }
    }
    
    componentDidMount() {
        var navbar = this.props.navbar;

        if(navbar.props.isSuperAdmin) {
            genericResourceGET(`/user?isAdmin=True`, "users", this);
        } else {
            genericResourceGET(`/user?course_id=${navbar.state.chosenCourse["course_id"]}`, "users", this);
        }

        genericResourceGET("/role?", "roles", this);
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            users,
            roles
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;

        navbar.adminViewUsers = {};
        navbar.adminViewUsers.users = users ? users : [];
        navbar.adminViewUsers.role_names = roles ? parseRoleNames(roles) : [];

        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Users"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Users"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !users || !roles) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (user===null && addUser===null) {
            return(
                <Box>
                    <ViewUsers
                        navbar={navbar}
                    />
                </Box>
            )
        } else {
            return(
                <Box>
                    <AdminAddUser
                        navbar={navbar}
                    />
                </Box>
            )
        }
    }
}

export default AdminViewUsers;
