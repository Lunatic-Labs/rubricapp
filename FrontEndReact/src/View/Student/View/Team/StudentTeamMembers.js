import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './TeamMembers.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';

/**
 * @description
 * Student-facing view that shows the members of the currently selected team.
 *
 * Responsibilities:
 *  - Reads the selected team from navbar.state.team.
 *  - Fetches users for that team in the current course.
 *  - Stores the users in navbar.studentTeamMembers for the child table component.
 *
 * Props:
 *  @prop {object} navbar - Navbar instance; expects:
 *                          - state.chosenCourse.course_id
 *                          - state.team (with team_id).
 *
 * State:
 *  @property {boolean|null} isLoaded     - True once the user list has been loaded.
 *  @property {string|null}  errorMessage - Error message from the fetch, if any.
 *  @property {Array|null}   users        - Users returned for the selected team.
 */
class StudentTeamMembers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            users: null
        }
    }

    /**
     * @method componentDidMount
     * @description
     * On mount, loads the users for the selected team in this course.
     *
     * Fetch:
     *  - GET /user?course_id={course_id}&team_id={team_id}&assign=true
     *
     *  Query parameters:
     *    - course_id : navbar.state.chosenCourse.course_id
     *    - team_id   : navbar.state.team.team_id
     *    - assign    : boolean flag (true) indicating we're retrieving users
     *                  currently assigned to this team.
     *
     *  Data usage:
     *    - genericResourceGET stores the result array in state.users and updates
     *      isLoaded/errorMessage.
     *
     * Sorting:
     *  - No explicit sorting is done here; users are passed as-is to the table.
     *    Column sorting is handled by CustomDataTable in TeamMembers.js.
     *
     * Possible JIRA note:
     *  - If another component in the same flow also calls /user?course_id&team_id
     *    for the same team, those calls could be consolidated.
     */
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        var courseID = state.chosenCourse.course_id; 

        genericResourceGET(
            `/user?course_id=${courseID}&team_id=${team["team_id"]}&assign=${true}`,
            "users", this
        );
    }

    /**
     * @method render
     * @description
     * Handles loading and error states and, once data is ready, renders:
     *  - A header ("Student View: Team Members")
     *  - <ViewTeamMembers />, which reads users from navbar.studentTeamMembers.users
     *  - A placeholder "Add Member" button (wired up later).
     *
     * Networking:
     *  - No network calls are made here; this uses the users loaded in componentDidMount.
     */
    render() {
        const {
            isLoaded,
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;
        navbar.studentTeamMembers = {};
        navbar.studentTeamMembers.users = users;

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
            return(
                <div className='container'>
                    <h1 className='mt-5'>Student View: Team Members</h1>

                    <ViewTeamMembers
                        navbar={navbar}
                    />

                    <div className='d-flex justify-content-end'>
                        <button
                            className='mt-3 btn btn-primary'

                            //TO DO
                            // onClick={() => {
                                // console.log("Add Members!");
                            // }}
                        >
                            Add Member
                        </button>
                    </div>
                </div>
            )
        }
    }
}

export default StudentTeamMembers;
