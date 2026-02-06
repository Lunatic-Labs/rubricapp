import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

/**
 * @description
 * Wrapper view that loads the student's default team for the current course,
 * then passes it to ConfirmCurrentTeamTable for display and confirmation.
 *
 * Responsibilities:
 *  - Fetches the student's current team and its members for the selected course.
 *  - Handles loading and error states.
 *  - Once loaded, renders <ConfirmCurrentTeamTable /> with the team data.
 *
 * Props:
 *  @prop {Object} navbar - Navbar instance; expects state.chosenCourse["course_id"].
 *
 * State:
 *  @property {boolean|null} isLoaded     - True when the /team_members request completes.
 *  @property {string|null}  errorMessage - Error string from the fetch, if any.
 *  @property {Object|null}  teamMembers  - Team info returned from the backend
 *                                          (expected keys: users, team_id, team_name).
 */
interface StudentConfirmCurrentTeamProps {
    navbar: any;
    students?: any;
    chosenCourse?: any;
}

interface StudentConfirmCurrentTeamState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    teamMembers: any | null;
}

class StudentConfirmCurrentTeam extends Component<StudentConfirmCurrentTeamProps, StudentConfirmCurrentTeamState> {
    constructor(props: StudentConfirmCurrentTeamProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            teamMembers: null,
        };
    }

    /**
     * @method componentDidMount
     * @description
     * On mount, fetches the current student's default team for this course.
     *
     * Fetch:
     *  - GET /team_members?course_id={course_id}
     *
     *  - Query parameters:
     *      * course_id — from this.props.navbar.state.chosenCourse["course_id"].
     *
     *  - genericResourceGET:
     *      genericResourceGET(url, "team_members", this, { dest: "teamMembers" })
     *      → expected to:
     *        * store the response in state.teamMembers, and
     *        * set isLoaded / errorMessage appropriately.
     *
     * Data usage:
     *  - teamMembers["users"]     → passed as the students list.
     *  - teamMembers["team_id"]   → passed as teamId.
     *  - teamMembers["team_name"] → passed as teamName.
     *
     * Sorting:
     *  - No sorting is performed here; all ordering of team members is
     *    whatever the backend returns. ConfirmCurrentTeamTable simply
     *    renders them in a CustomDataTable.
     *
     * Possible JIRA note:
     *  - /team_members is also used in TAViewTeams with additional filters.
     *    If this endpoint returns more team data than necessary for a single
     *    student and relies on the backend/user context to filter, that
     *    should be documented and possibly tightened server-side.
     */
    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(
            `/team_members?course_id=${courseId}`,
            "team_members", this as any, {dest: "teamMembers"}
        );
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            teamMembers
        } = this.state;

        if (errorMessage) {
            return (
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !teamMembers) {
            return (
                <Loading />
            )

        } else {
            return (
                <ConfirmCurrentTeamTable
                    students={teamMembers["users"]}
                    teamId={teamMembers["team_id"]}
                    teamName={teamMembers["team_name"]}
                    navbar={this.props.navbar}
                />
            )
        }
    }
}

export default StudentConfirmCurrentTeam;
