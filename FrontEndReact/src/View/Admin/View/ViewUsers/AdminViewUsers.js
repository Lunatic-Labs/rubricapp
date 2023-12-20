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
        var chosenCourse = this.props.navbar.state.chosenCourse;
        var navbar = this.props.navbar;
        if(navbar.props.isSuperAdmin) {
            genericResourceGET(`/user?isAdmin=True`, "users", this);
        } else {
            genericResourceGET(`/user?course_id=${chosenCourse["course_id"]}`, "users", this);
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
        var role_names = parseRoleNames(roles);
        navbar.adminViewUsers = {};
        navbar.adminViewUsers.users = users ? users : [];
        navbar.adminViewUsers.roles = roles;
        navbar.adminViewUsers.role_names = role_names;
        var parsedRoleNames = parseRoleNames(roles ? roles : []);
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
        } else if (!isLoaded || !users || !roles || !role_names) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (user===null && addUser===null) {
            return(
                <Box>
                    <AdminAddUser
                        navbar={this.props.navbar}
                        user={this.props.user}
                        addUser={this.props.addUser}
                        chosenCourse={this.props.chosenCourse}
                        roles={parsedRoleNames}
                    />
                </Box>
            )
        } else {
            return(
                <Box>
                    <ViewUsers
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                        roles={roles}
                        role_names={role_names}
                        setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                    />
                </Box>
            )
        }
    }
}

export default AdminViewUsers;
