import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames } from '../../../../utility';

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
        // TODO: Update logic to view only role_id 3 of Admin Users for SuperAdmin using isAdmin attribute in User table!
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
        } else if (!isLoaded || !users || !roles) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (this.props.user || this.props.addUser) {
            return(
                <div className="container">
                    <AdminAddUser
                        navbar={this.props.navbar}
                        user={this.props.user}
                        addUser={this.props.addUser}
                        chosenCourse={this.props.chosenCourse}
                        roles={parsedRoleNames}
                        // TODO: Update logic to use isAdmin attribute!
                        // role_id={this.props.role_id}
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
                        roles={parsedRoleNames}
                        // role_id={this.props.role_id}
                    />
                </div>
            )
        }
    }
}

export default AdminViewUsers;