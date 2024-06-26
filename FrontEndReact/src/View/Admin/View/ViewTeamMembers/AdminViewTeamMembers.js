import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './ViewTeamMembers.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../../utility.js';
import { Button, Typography } from '@mui/material';
import Loading from '../../../Loading/Loading.js';



class AdminViewTeamMembers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: null,
            users: []
        }
    }
    
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        var courseID = state.chosenCourse.course_id; 

        genericResourceGET(
            `/user?course_id=${courseID}&team_id=${team["team_id"]}&assign=${true}`,
            'users', this
        );
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            users
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        var setAddTeamTabWithTeam = navbar.setAddTeamTabWithTeam;

        if (errorMessage) {
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
                <Loading />
            )

        } else {
            navbar.adminViewTeamMembers = {};
            navbar.adminViewTeamMembers.users = users;

            return(
                <div className='container'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="adminViewTeamMembersTitle"> 
                            {team["team_name"]}
                        </Typography>

                        <div className='d-flex justify-content-end gap-3'>
                            <Button
                                className='mt-3 mb-3 btn btn-primary'
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color: "white"
                                }}
                                onClick={() => {
                                    setAddTeamTabWithTeam(
                                        [team],
                                        team["team_id"],
                                        parseUserNames(users),
                                        "AdminEditTeamMembers",
                                        "Add"
                                    );
                                }}
                                aria-label='addMemberButton'
                            >
                                Add Member
                            </Button>

                            <Button
                                className='mt-3 mb-3 btn btn-primary'
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color: "white"
                                }}
                                onClick={() => {
                                    this.props.navbar.setAddTeamTabWithTeam(
                                        [team],
                                        team["team_id"],
                                        parseUserNames(users),
                                        "AdminEditTeamMembers",
                                        "Remove"
                                    );
                                }}
                                aria-label='removeMemberButton'
                            >
                                Remove Member
                            </Button>
                        </div>
                    </div>

                    <ViewTeamMembers
                        navbar={navbar}
                    />
                </div>
            )
        }
    }
}

export default AdminViewTeamMembers;
