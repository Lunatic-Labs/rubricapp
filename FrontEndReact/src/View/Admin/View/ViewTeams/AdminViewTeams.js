import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import AdminBulkUpload from '../../Add/AddTeam/AdminTeamBulkUpload';
import { API_URL } from '../../../../App';

class AdminViewTeams extends Component {
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
        } else if (this.props.show === "AdminTeamBulkUpload" && users) {
            first_last_names_list = [];
            retrieved_users = this.props.chosenCourse["use_tas"] ? this.props.users[0]:this.props.users;
            for(u = 0; u < retrieved_users.length; u++) {
                first_last_names_list = [...first_last_names_list, retrieved_users[u]["first_name"] + " " + retrieved_users[u]["last_name"]];
            }
            return(
                <AdminBulkUpload
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
                    <div className='d-flex justify-content-end gap-3'>
                        <button
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                console.log("Auto Assign Team");
                            }}
                        >
                            Auto Assign Teams
                        </button>
                        <button
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                this.props.setNewTab("AdminTeamBulkUpload");
                            }}
                        >
                            Bulk Upload
                        </button>
                        <button
                            id="addTeamButton"
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                this.props.setAddTeamTabWithUsers(users, "AddTeam");
                            }}
                        >
                            Add Team
                        </button>
                    </div>
                </div>
            )
        }
    }
}

export default AdminViewTeams;