import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewUsers from './ViewUsers';
import AdminAddUser from '../../Add/AddUsers/AdminAddUser';

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
        fetch(`http://127.0.0.1:5000/api/user?course_id=${this.props.chosenCourse["course_id"]}`)
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
        fetch("http://127.0.0.1:5000/api/role")
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
        var user = this.props.user;
        var addUser = this.props.addUser;
        if(error) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { error.message }</h1>
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { errorMessage }</h1>
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
                        role_names={role_names}
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
                        role_names={role_names}
                        setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                    />
                </div>
            )
        }
    }
}

export default AdminViewUsers;