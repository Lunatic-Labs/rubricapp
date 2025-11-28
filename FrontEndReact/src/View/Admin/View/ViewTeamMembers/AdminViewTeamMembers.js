import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './ViewTeamMembers.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../../utility.js';
import { Button, Typography } from '@mui/material';
import Loading from '../../../Loading/Loading.js';

/**
 * Creates an instance of the Admin////viewTeamMembers component.
 * Displays team members for a specific team with the option to add or remove members.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * @property {string|null} state.errorMessage - The error message to display if an error occurs during data fetching.
 * @property {boolean|null} state.isLoaded - Indicates whether the data has been loaded.
 * @property {Array} state.users - The list of users who are members of the team.
 * 
 */

class AdminViewTeamMembers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: null,
            users: []
        }
    }
    
    /**
     * @method componentDidMount - Fetches the team members when the component is mounted.
     * 
     * API Endpoint: /user 
     * HTTP Method: GET
     * 
     * Parameters:
     * @param {string} course_id - The ID of the course.
     * @param {string} team_id - The ID of the team.
     * @param {boolean} assign - Flag to indicate fetching assigned users.
     * 
     * Response:
     * Users assigned to the specified team within the course.
     * Filtered records based on ...
     * 
     * Sorting:
     * 
     * Usage:
     * This method is called automatically when the component is mounted to fetch the team members.
     * 
     * TODO:
     * Verify if ViewTeamMembers component also fetches user data.
     * 
     */
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
                            {/**
                             * @button Add Member - Button to add a new member to the team.
                             */}
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
                                {/**
                                 * @button Remove Member - Button to remove an existing member from the team.
                                 */}
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
