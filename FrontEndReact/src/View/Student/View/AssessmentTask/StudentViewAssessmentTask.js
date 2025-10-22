import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRubricNames } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';
import Cookies from 'universal-cookie';

/**
 * @description Renders the my assessment section of the website.
 * 
 * @prop {object} navbar - Passed navbar.
 * @prop {object} role - Object with role_id and role_name.
 * @prop {object} filteredAssessments - Filtered ATs.
 * @prop {object} CompleteAssessments - CATs.
 * 
 * @property {object} errorMessage - Any errors encountered.
 * @property {bool} isLoaded - Did requests complete without issues.
 * @property {object} checkin - Server response to saving a student checking in.
 * @property {object} rubrics - Rubrics for the current user.
 * @property {number} currentUserId - Current logged-in user's ID.
 * 
 */

class StudentViewAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            checkin: null,
            rubrics: null,
            currentUserId: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourseID = state.chosenCourse["course_id"];

        // Get current user ID from cookies
        const cookies = new Cookies();
        const user = cookies.get('user');
        const currentUserId = user ? user.user_id : null;

        this.setState({ currentUserId });

        genericResourceGET(`/checkin?course_id=${chosenCourseID}`,"checkin", this);

        genericResourceGET(`/rubric?all=${true}`, "rubrics", this);

        genericResourceGET(`/course?course_id=${chosenCourseID}`, "course_count", this, {dest: "counts"});
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            checkin,
            rubrics,
            counts,
            currentUserId,
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
        } else if (!isLoaded || !checkin || !rubrics || !counts || !currentUserId) {
            return(
                <Loading />
            )

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
                        currentUserId={currentUserId}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;