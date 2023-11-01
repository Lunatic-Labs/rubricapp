import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Admin/Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../Error/ErrorMessage';
import AdminEditTeam from '../../Admin/Add/AddTeam/AdminEditTeam';
import { genericResourceGET } from '../../../utility';

class StudentViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null
        }
    }
    // The current StudentViewTeams is based upon the selected course ID.
    // It was debated on whether or not when the student logs in if they should see
    // the student dahsboard, or choose course first. The reason it is getting the course_id
    // is because we needed to check to see if it would only display the data for a specific course.
    // This logic should most likely be changed to incorporate the student_id or use the user course table.
    componentDidMount() {
        genericResourceGET(`/team?course_id=${this.props.chosenCourse["course_id"]}`, "teams", this);
        var url = (
            this.props.chosenCourse["use_tas"] ?
            `/user?course_id=${this.props.chosenCourse["course_id"]}&role_id=4` :
            `/user/${this.props.chosenCourse["admin_id"]}?`
        );
        genericResourceGET(url, "users", this);
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
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
        } else if (this.props.show==="AddTeam" && users) {
            var first_last_names_list = [];
            var retrieved_users = this.props.chosenCourse["use_tas"] ? this.props.users:this.props.users;
            for(var u = 0; u < retrieved_users.length; u++) {
                first_last_names_list = [...first_last_names_list, retrieved_users[u]["first_name"] + " " + retrieved_users[u]["last_name"]];
            }
            return(
                <AdminAddTeam
                    team={this.props.team}
                    addTeam={this.props.addTeam}
                    users={this.props.users}
                    first_last_names_list={first_last_names_list}
                    chosenCourse={this.props.chosenCourse}
                />
            )
        } else if (users) {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={this.props.navbar}
                        teams={teams}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                    />
                </div>
            )
        } else if (users) {
            return(
                <div className="container">
                    <AdminEditTeam
                        navbar={this.props.navbar}
                        teams={teams}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                        >
                    </AdminEditTeam>
                </div>
            )
        }
    }
}

export default StudentViewTeams;