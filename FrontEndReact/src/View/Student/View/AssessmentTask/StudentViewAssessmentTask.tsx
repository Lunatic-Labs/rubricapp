import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRubricNames } from '../../../../utility';
import Loading from '../../../Loading/Loading';

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
 * 
 */

interface StudentViewAssessmentTaskProps {
    navbar: any;
    role: any;
    filteredAssessments: any[];
    CompleteAssessments: any[];
    userTeamIds: any[];
}

interface StudentViewAssessmentTaskState {
    errorMessage: string | null;
    isLoaded: boolean;
    checkin: any[] | null;
    rubrics: any[] | null;
    counts?: any;
}

class StudentViewAssessmentTask extends Component<StudentViewAssessmentTaskProps, StudentViewAssessmentTaskState> {
    constructor(props: StudentViewAssessmentTaskProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            checkin: null,
            rubrics: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourseID = state.chosenCourse["course_id"];

        genericResourceGET(`/checkin?course_id=${chosenCourseID}`,"checkin", this as any);

        genericResourceGET(`/rubric?all=${true}`, "rubrics", this as any);

        genericResourceGET(`/course?course_id=${chosenCourseID}`, "course_count", this as any, {dest: "counts"});
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
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !checkin || !rubrics || !counts) {
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
                        rubricNames={rubrics ? parseRubricNames(rubrics) as any : []}
                        counts={counts}
                        userTeamIds={this.props.userTeamIds}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;
