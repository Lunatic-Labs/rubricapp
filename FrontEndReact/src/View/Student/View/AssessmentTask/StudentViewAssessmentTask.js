import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRubricNames } from '../../../../utility.js';



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

        genericResourceGET(`/assessment_task?course_id=${chosenCourseID}&role_id=5`, "assessmentTasks", this);

        genericResourceGET(`/checkin?course_id=${chosenCourseID}`, "checkin", this);

        genericResourceGET(`/rubric`, "rubrics", this);

        genericResourceGET(`/completed_assessment?course_id=${chosenCourseID}`, "completedAssessments", this);
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
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )

        } else {
            var navbar = this.props.navbar;
            
            var studentAssessments = assessmentTasks.filter((at) => (at["role_id"] === role["role_id"])); // keeps only assessment relevant to this role

            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        role={role}
                        assessmentTasks={studentAssessments}
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