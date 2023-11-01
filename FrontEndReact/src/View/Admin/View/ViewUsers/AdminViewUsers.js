import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

class AdminViewUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: [],
            roles: null
        }
    }
    
    componentDidMount() {
        genericResourceGET(`/user?course_id=${this.props.chosenCourse["course_id"]}`, "users", this);
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
        var user = this.props.user;
        var addUser = this.props.addUser;
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
                <div className="container">
                    <AdminAddUser
                        navbar={this.props.navbar}
                        user={user}
                        addUser={addUser}
                        chosenCourse={this.props.chosenCourse}
                        roles={roles}
                        role_names={roles}
                    />
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewUsers
                        navbar={this.props.navbar}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                        roles={roles}
                        role_names={roles}
                        setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                    />
                </div>
            )
        }
    }
}

export default AdminViewUsers;