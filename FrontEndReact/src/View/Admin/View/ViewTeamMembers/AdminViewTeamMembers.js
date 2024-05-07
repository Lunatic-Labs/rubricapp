import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './ViewTeamMembers.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../../utility.js';
import { Button, Typography } from '@mui/material';



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
        var chosenCourse = state.chosenCourse.course_id; 

        genericResourceGET(
            `/user?course_id=${chosenCourse}&team_id=${team["team_id"]}&assign=${true}`,
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
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )

        } else {
            navbar.adminViewTeamMembers = {};
            navbar.adminViewTeamMembers.users = users;

            return(
                <div className='container'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <Typography sx={{fontWeight:'700'}} variant="h5"> 
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
                                        "AdminEditTeam",
                                        "Add"
                                    );
                                }}
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
                                        "AdminEditTeam",
                                        "Remove"
                                    );
                                }}
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
