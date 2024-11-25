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

        if (userRole === 5) {       // If the user is a student, this returns completed assessments for the student

            genericResourceGET(
                `/assessment_task?course_id=${chosenCourseID}`, 
                "assessment_tasks", this, {dest: "assessmentTasks"});

            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}`, 
                "completed_assessments", this, {dest: "completedAssessments"});
        } else {            // If the user is a TA, this returns assessments completed by the TA
            genericResourceGET(
                `/assessment_task?course_id=${chosenCourseID}&role_id=${userRole}`, 
                "assessment_tasks", this, {dest: "assessmentTasks"});

                genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}&role_id=${userRole}`, 
                "completed_assessments", this, {dest: "completedAssessments"});
        }

        genericResourceGET(
            `/checkin?course_id=${chosenCourseID}`,
            "checkin", this);

        genericResourceGET(
            `/rubric?all=${true}`, "rubrics", this);

        genericResourceGET(
            `/course?course_id=${chosenCourseID}`, 
            "course_count", this, {dest: "counts"});
        }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            completedAssessments,
            checkin,
            rubrics,
            counts
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

        } else if (!isLoaded || !assessmentTasks || !checkin || !rubrics || !counts || !completedAssessments) {
            return(
                <Loading />
            )

        } else {
            // All AT.id === CAT.id means it is completed, do not
            // display it in the TODO ATs.
            let uncompletedAssessments = assessmentTasks.filter(task =>
                !completedAssessments.some(completed =>
                    completed.assessment_task_id === task.assessment_task_id
                )
            );

            // All ATs that are past due needs to be not shown
            // in the TODO ATs.
            for (let i = 0; i < uncompletedAssessments.length; i++) {
                const dueDate = new Date(uncompletedAssessments[i].due_date);
                const currentDate = new Date();

                if (dueDate < currentDate) {
                    completedAssessments.push(uncompletedAssessments[i]);
                    uncompletedAssessments.splice(i, 1);
                    i--;
                }
            }

            for (let i = 0; i < uncompletedAssessments.length; i++) {
                if (uncompletedAssessments[i].locked) {
                    completedAssessments.push(uncompletedAssessments[i]);
                    uncompletedAssessments.splice(i, 1);
                    i--;
                }
            }

            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        role={role}
                        assessmentTasks={uncompletedAssessments}
                        completedAssessments={completedAssessments}
                        checkin={checkin}
                        rubricNames={rubrics ? parseRubricNames(rubrics) : []}
                        counts={counts}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;
