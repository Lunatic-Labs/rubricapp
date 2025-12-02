import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRubricNames } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';

/**
 * @description
 * Renders the "My Assessment Tasks" section for a student/TA. This component:
 *  - Fetches per-course check-in info, rubric metadata, and course counts.
 *  - Relies on filtered ATs/CATs passed in from a parent (e.g. StudentDashboard).
 *  - Hands everything off to <ViewAssessmentTasks /> for display and sorting.
 *
 * @prop {object} navbar               - Navbar instance (used to get chosenCourse).
 * @prop {object} role                 - Object with role_id and role_name.
 * @prop {Array}  filteredAssessments  - Filtered ATs for this user/course.
 * @prop {Array}  CompleteAssessments  - CATs associated with filteredAssessments.
 * @prop {Array}  userTeamIds          - IDs of teams the student belongs to (optional).
 *
 * @property {object|null} errorMessage - Any errors encountered while fetching.
 * @property {boolean}     isLoaded     - True when all requests for this view have completed.
 * @property {object|null} checkin      - Server response to the student's check-in status.
 * @property {Array|null}  rubrics      - Raw rubric data for the current user.
 * @property {object|null} counts       - Course-level counts/metadata from /course.
 *
 * Note: This component does not perform any sorting of ATs/CATs; that is handled
 * in ViewAssessmentTasks.js.
 */

class StudentViewAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            checkin: null,
            rubrics: null,
            counts: null,
        }
    }

    /**
     * @method componentDidMount
     * @description
     * On mount, loads per-course data needed to render the "My Assessment Tasks" view.
     *
     * Fetches:
     *  - GET /checkin?course_id={course_id}
     *      - Query params:
     *          * course_id — ID of the currently selected course.
     *      - Stores result in state.checkin.
     *
     *  - GET /rubric?all=true
     *      - Query params:
     *          * all=true — return all rubrics this user can access.
     *      - Stores result in state.rubrics.
     *      - Possible JIRA: may be over-fetching (all rubrics vs. just rubrics
     *        used in this course); rubrics are also fetched in StudentDashboard,
     *        so this may duplicate work across views.
     *
     *  - GET /course?course_id={course_id}
     *      - Query params:
     *          * course_id — ID of the currently selected course.
     *      - Stores result in state.counts (course_count).
     *
     * genericResourceGET is responsible for updating isLoaded and errorMessage.
     */
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourseID = state.chosenCourse["course_id"];

        // Per-course check-in status for the current student
        genericResourceGET(`/checkin?course_id=${chosenCourseID}`, "checkin", this);

        // Rubric metadata used to build rubricNames for the table
        genericResourceGET(`/rubric?all=${true}`, "rubrics", this);

        // Course counts/metadata needed by ViewAssessmentTasks (e.g., number of students)
        genericResourceGET(`/course?course_id=${chosenCourseID}`, "course_count", this, { dest: "counts" });
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            checkin,
            rubrics,
            counts,
        } = this.state;

        const filteredATs = this.props.filteredAssessments;
        const filteredCATs = this.props.CompleteAssessments;

        var navbar = this.props.navbar;
        var role = this.props.role;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !checkin || !rubrics || !counts) {
            return <Loading />;
        } else {
            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        role={role}
                        assessmentTasks={filteredATs}
                        completedAssessments={filteredCATs}
                        checkin={checkin}
                        rubricNames={rubrics ? parseRubricNames(rubrics) : []}
                        counts={counts}
                        userTeamIds={this.props.userTeamIds}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;
