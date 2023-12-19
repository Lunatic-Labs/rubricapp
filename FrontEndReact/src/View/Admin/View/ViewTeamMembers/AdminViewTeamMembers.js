import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './ViewTeamMembers';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames } from '../../../../utility';

class AdminViewTeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: null,
            users: []
        }
    }
    
    componentDidMount() {
        genericResourceGET(
            `/user?team_id=${this.props.team["team_id"]}&assign=${true}`,
            'users', this
        );
    }

    render() {
        var team = this.props.team;
        const {
            error,
            errorMessage,
            isLoaded,
            users
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team Members"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team Members"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !users) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <h1 className='mt-5'>Team Members</h1>
                    <h2 className='mt-3'> {team["team_name"]}</h2>
                    <ViewTeamMembers
                        users={users}
                    />
                    <div className='d-flex justify-content-end gap-3'>
                        <button
                            className='mt-3 btn btn-primary'
                            onClick={() => {
                                this.props.navbar.setAddTeamTabWithTeam(
                                    [team],
                                    team["team_id"],
                                    parseUserNames(users),
                                    "AdminEditTeam",
                                    "Add"
                                );
                            }}
                        >
                            Add Member
                        </button>
                        <button
                            className='mt-3 btn btn-primary'
                            onClick={() => {
                                this.props.navbar.setAddTeamTabWithTeam(
                                    [team],
                                    team["team_id"],
                                    parseUserNames(users),
                                    "AdminEditTeam",
                                    "Remove"
                                );
                            }}
                        >
                            Remove Member
                        </button>
                    </div>
                </div>
            )
        }
    }
}

export default AdminViewTeamMembers;