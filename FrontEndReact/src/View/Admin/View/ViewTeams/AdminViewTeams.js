import 'bootstrap/dist/css/bootstrap.css';
import React, { Component } from 'react';
import ErrorMessage from '../../../Error/ErrorMessage';
import ViewTeams from './ViewTeams';
import { genericResourceGET, parseUserNames } from '../../../../utility';

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
            `/user?uid=${this.props.chosenCourse["admin_id"]}`
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
        } else if (!isLoaded || !teams || !users) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={this.props.navbar}
                        teams={teams} 
                        users={parseUserNames(users)}
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
                                this.props.navbar.setAddTeamTabWithUsers(parseUserNames(users), "AddTeam");
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