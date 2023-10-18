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
        // We need to custom update the role_names
        // var role_names = [""];
        // for(var r = 0; r < result["content"]["roles"][0].length; r++) {
        //     role_names = [...role_names, result["content"]["roles"][0][r]["role_name"]];
        // }
        // this.setState({
        //     isLoaded: true,
        //     roles: result["content"]["roles"][0],
        //     role_names: role_names
        // })
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