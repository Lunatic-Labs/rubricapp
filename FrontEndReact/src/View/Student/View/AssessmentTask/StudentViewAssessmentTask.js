import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRubricNames } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';



class StudentViewAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            assessmentTasks: null,
            checkin: null,
            rubrics: null,
            completedAssessments: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourseID = state.chosenCourse["course_id"];

        var userRole = this.props.role["role_id"];

        genericResourceGET(`/assessment_task?course_id=${chosenCourseID}`, "assessmentTasks", this);

        genericResourceGET(`/checkin?course_id=${chosenCourseID}`, "checkin", this);

        genericResourceGET(`/rubric?all=${true}`, "rubrics", this);

        if (userRole === 5) {       // If the user is a student, this returns completed assessments for the student
            genericResourceGET(`/completed_assessment?course_id=${chosenCourseID}`, "completedAssessments", this);
        } else {            // If the user is a TA, this returns assessments completed by the TA
            genericResourceGET(`/completed_assessment?course_id=${chosenCourseID}&role_id=${userRole}`, "completedAssessments", this);
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            completedAssessments,
            checkin,
            rubrics,
        } = this.state;

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

        } else if (!isLoaded ||!assessmentTasks || !checkin || !rubrics) {
            return(
                <Loading />
            )

        } else {
            console.log("completedAssessments: ", this.state.completedAssessments);
            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        role={role}
                        assessmentTasks={assessmentTasks}
                        completedAssessments={completedAssessments}
                        checkin={checkin}
                        rubricNames={rubrics ? parseRubricNames(rubrics) : []}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;