import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import { Box } from '@mui/material';

class AdminViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: [],
            roles: null,
            role_names: null
        }
    }
    componentDidMount() {
        var chosenCourse = this.props.navbar.state.chosenCourse;
        fetch(API_URL + `/user?course_id=${chosenCourse["course_id"]}`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    users: result['content']['users'][0]
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
        fetch(API_URL + "/role")
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                var role_names = [""];
                for(var r = 0; r < result["content"]["roles"][0].length; r++) {
                    role_names = [...role_names, result["content"]["roles"][0][r]["role_name"]];
                }
                this.setState({
                    isLoaded: true,
                    roles: result["content"]["roles"][0],
                    role_names: role_names
                })
            }
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            users,
            roles,
            role_names
        } = this.state;
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addUser = state.addUser;
        var chosenCourse = state.chosenCourse;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
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
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (user || addUser) {
            return(
                <Box>
                    <AdminAddUser
                        user={user}
                        addUser={addUser}
                        chosenCourse={chosenCourse}
                        roles={roles}
                        role_names={role_names}
                    />
                </Box>
            )
        } else {
            return(
                <Box>
                    <ViewUsers
                        users={users}
                        chosenCourse={chosenCourse}
                        roles={roles}
                        role_names={role_names}
                        setAddUserTabWithUser={setAddUserTabWithUser}
                    />
                </Box>
            )
        }
    }
}

export default AdminViewUsers;
