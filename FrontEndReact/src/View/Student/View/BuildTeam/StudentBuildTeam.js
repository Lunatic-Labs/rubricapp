import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam.js'
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';

// NOTE: Using User_routes.py
// Currently a copy of StudentManageCurrentTeam file

class StudentManageCurrentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            users: null
        };
    }

    componentDidMount() {
        var course_id = this.props.navbar.state.chosenCourse.course_id;

        genericResourceGET(`/user?course_id=${course_id}`, "users", this);
    }

    render() {
        const {
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Manage Team"}
                        errorMessage={errorMessage} 
                    />	
                </div>
            )
        } else if (!users) {
            return (
                <div className='container'>
                    <h1>loading...</h1>
                </div>
            )
        } else {
            return(
                <BuildTeamTable 
                    navbar={navbar}
                    users={this.state.users}
                />
            )
        }
    }
}

export default StudentManageCurrentTeam;
