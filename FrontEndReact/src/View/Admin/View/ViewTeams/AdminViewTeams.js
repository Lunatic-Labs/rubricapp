import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import AdminBulkUpload from '../../Add/AddTeam/AdminTeamBulkUpload';
import { genericResourceGET } from '../../../../utility';

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
        } else if (this.props.show === "AdminTeamBulkUpload" && users) {
            first_last_names_list = [];
            retrieved_users = this.props.chosenCourse["use_tas"] ? this.props.users:this.props.users;
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
                        navbar={this.props.navbar}
                        teams={teams} 
                        users={users}
                        chosenCourse={this.props.chosenCourse}
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
                                this.props.navbar.setNewTab("AdminTeamBulkUpload");
                            }}
                        >
                            Bulk Upload
                        </button>
                        <button
                            id="addTeamButton"
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                this.props.navbar.setAddTeamTabWithUsers(users, "AddTeam");
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