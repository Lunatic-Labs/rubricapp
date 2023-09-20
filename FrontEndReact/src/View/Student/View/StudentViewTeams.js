import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Admin/Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../Error/ErrorMessage';
import { API_URL } from '../../../App';

class StudentViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: [],
            users: []
        }
    }
    // The current StudentViewTeams is based upon the selected course ID.
    // It was debated on whether or not when the student logs in if they should see
    // the student dahsboard, or choose course first. The reason it is getting the course_id
    // is because we needed to check to see if it would only display the data for a specific course.
    // This logic should most likely be changed to incorporate the student_id or use the user course table.
    componentDidMount() {
        fetch(API_URL + `/team?course_id=${this.props.chosenCourse["course_id"]}`)
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        teams: result['content']['teams']
                    })
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
        var url = (
            this.props.chosenCourse["use_tas"] ?
            API_URL + `/user?course_id=${this.props.chosenCourse["course_id"]}&role_id=4` :
            API_URL + `/user/${this.props.chosenCourse["admin_id"]}`
        );
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        users: result['content']['users']
                    })
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
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
            var retrieved_users = this.props.chosenCourse["use_tas"] ? this.props.users[0]:this.props.users;
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
                        teams={teams}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                        setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;