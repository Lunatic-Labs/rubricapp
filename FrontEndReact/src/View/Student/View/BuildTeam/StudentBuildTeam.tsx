import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam'
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

/**
 * @description
 * Student-facing wrapper for the "Build Team" view.
 *
 * Responsibilities:
 *  - Fetches the list of users for the currently selected course.
 *  - Handles loading and error states.
 *  - Once loaded, passes the user list to <BuildTeamTable /> so the student
 *    can build or adjust a team roster.
 *
 * @prop {Object} navbar - Navbar instance; expects state.chosenCourse.course_id.
 *
 * @property {boolean|null} state.isLoaded     - True once the /user fetch has resolved.
 * @property {string|null}  state.errorMessage - Error message from the fetch, if any.
 * @property {Array|null}   state.users        - Users returned for the current course.
 */

interface StudentManageCurrentTeamProps {
    navbar: any;
}

interface StudentManageCurrentTeamState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    users: any[] | null;
}

class StudentManageCurrentTeam extends Component<StudentManageCurrentTeamProps, StudentManageCurrentTeamState> {
    constructor(props: StudentManageCurrentTeamProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            users: null
        };
    }

    /**
     * @method componentDidMount
     * @description
     * On mount, fetches all users for the currently selected course so the
     * student can build a team from the full roster.
     *
     * Fetch:
     *  - GET /user?course_id={course_id}
     *    - Query params:
     *        * course_id — course ID from navbar.state.chosenCourse["course_id"].
     *    - genericResourceGET stores the result in state.users and updates
     *      isLoaded/errorMessage.
     *
     * Sorting:
     *  - No explicit sorting is done here; data is passed to BuildTeamTable as-is.
     *    Any column sorting is handled by CustomDataTable inside BuildTeamTable.
     *
     * Notes / JIRA candidate:
     *  - This call retrieves all users for the course. If other components in the
     *    same flow (e.g., other team views or dashboards) also call /user?course_id
     *    for the same course, those duplicate fetches could be consolidated and
     *    tracked via a JIRA task.
     */
    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(
            `/user?course_id=${courseId}`, 
            "users", this as any);
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage} 
                    />
                </div>
            )

        } else if (!isLoaded || !users) {
            return (
                <Loading />
            )

        } else {
            return(
                <BuildTeamTable 
                    navbar={navbar}
                    users={this.state.users || []}
                />
            )
        }
    }
}

export default StudentManageCurrentTeam;
