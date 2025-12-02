import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams.js';
import ErrorMessage from '../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../utility.js';
import Loading from '../../Loading/Loading.js';

/**
 * @description
 * Student-facing view of teams for the current course.
 *
 * Responsibilities:
 *  - Fetches all teams that the current student belongs to in this course.
 *  - Fetches either TAs (if use_tas is true) or the instructor user for this course.
 *  - Passes team and user-name data to <ViewTeams />.
 *
 * Props:
 *  @prop {Object} navbar                 - Navbar instance with state.chosenCourse.
 *  @prop {Function} updateUserTeamsIds   - Callback to update the parent with the
 *                                          list of team_ids this user is in.
 *
 * State:
 *  @property {string|null} errorMessage  - Error message from fetches, if any.
 *  @property {boolean}     isLoaded      - True once both teams and users are loaded.
 *  @property {Array|null}  teams         - Teams returned for this user in this course.
 *  @property {Array|null}  users         - TA or instructor user records.
 */
class StudentViewTeams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null
        }
    }

    /**
     * @method componentDidMount
     * @description
     * Loads team and instructor/TA data for the current course.
     *
     * Fetch 1:
     *  - GET /team_by_user?course_id={course_id}&adhoc_mode={adhocMode}
     *    - course_id : navbar.state.chosenCourse.course_id
     *    - adhoc_mode: boolean; true if course is NOT using fixed teams.
     *    - Stores result in state.teams via genericResourceGET.
     *    - Also extracts team_ids from data.teams and calls updateUserTeamsIds(teamIds)
     *      so the parent (e.g., StudentDashboard) can filter team-based ATs/CATs.
     *
     * Fetch 2:
     *  - If chosenCourse.use_tas is true:
     *      GET /user?course_id={course_id}&role_id=4
     *      → list of TAs for the course.
     *    Else:
     *      GET /user?uid={admin_id}
     *      → single instructor user.
     *    - The result is stored in state.users.
     *
     * Sorting:
     *  - This component does not sort teams or users; they are passed as-is to <ViewTeams />.
     *    Column-level sorting (if any) is handled by CustomDataTable in ViewTeams.
     *
     * Possible JIRA notes:
     *  - /user?course_id&role_id=4 is also used in other admin/TA views; if the same TA
     *    list is fetched multiple times in the same flow, that could be consolidated.
     */
    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenCourse = state.chosenCourse;
        const chosenCourseId = chosenCourse["course_id"];
        const adhocMode = !chosenCourse.use_fixed_teams;

        genericResourceGET(
            `/team_by_user?course_id=${chosenCourseId}&adhoc_mode=${adhocMode}`, "teams", this
        ).then(data =>{
            let newTeams = [];
            data.teams.forEach(team => {
                newTeams.push(team.team_id);
            });
            this.props.updateUserTeamsIds(newTeams);
        }).catch(error => {
            console.error("Error fetching/parsing teams data:", error);
        }); //This requires future adjusting

        var url = (
            chosenCourse["use_tas"] ?
            `/user?course_id=${chosenCourseId}&role_id=4` :
            `/user?uid=${chosenCourse["admin_id"]}`
        );

        genericResourceGET(url, "users", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;

        if (errorMessage) {
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
                <Loading />
            )

        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={this.props.navbar}
                        teams={teams}
                        users={users ? parseUserNames(users) : []}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;
