import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility';

class StudentViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            assessment_tasks: null,
            roles: null, 
            rubrics: null, 
            checkin: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        genericResourceGET(`/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}&role_id=5`, "assessment_tasks", this);
        genericResourceGET(`/checkin?course_id=${navbar.state.chosenCourse["course_id"]}`, "checkin", this);
        genericResourceGET(`/role`, "roles", this);
        genericResourceGET(`/rubric`, "rubrics", this);
    }

    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            assessment_tasks,
            roles,
            rubrics,
            checkin
        } = this.state;

        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !assessment_tasks || !roles || !rubrics) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            var navbar = this.props.navbar;

            let student_assessments = assessment_tasks.filter((at) => (at.role_id === 5)); // keeps only assessment tasks the students fill out 
            navbar.studentViewAssessmentTask = {};
            navbar.studentViewAssessmentTask.assessment_tasks = student_assessments;
            navbar.studentViewAssessmentTask.role_names = roles ? parseRoleNames(roles) : [];
            navbar.studentViewAssessmentTask.rubric_names = rubrics ? parseRubricNames(rubrics) : [];

            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        checkin={checkin}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;