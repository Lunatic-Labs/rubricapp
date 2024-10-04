import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers.js';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRoleNames } from '../../../../utility.js';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';
import SuccessMessage from '../../../Success/SuccessMessage.js';



class AdminViewUsers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: null,
            roles: null
        }
    }
    
    componentDidMount() {
        var navbar = this.props.navbar;

        if(navbar.props.isSuperAdmin) {
            genericResourceGET(
                `/user?isAdmin=True`, "users", this);

        } else {
            genericResourceGET(
                `/user?course_id=${navbar.state.chosenCourse["course_id"]}`, 
                "users", this);
        }

        genericResourceGET(
            "/role?", "roles", this);
    }

    render() {
        const {
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
        navbar.adminViewUsers.roleNames = roles ? parseRoleNames(roles) : [];

        if (errorMessage) {
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
                <Loading />
            )

        } else if (user===null && addUser===null) {

            return(
                <Box>
                    {state.successMessage !== null && 
                        <div className='container'>
                          <SuccessMessage 
                            successMessage={state.successMessage}
                            aria-label="adminViewUsersSuccessMessage"
                          />
                        </div>
                    }
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
