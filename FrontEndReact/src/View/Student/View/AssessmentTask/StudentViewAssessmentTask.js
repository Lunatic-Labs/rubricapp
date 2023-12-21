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
            role: null, 
            rubric: null
        }
    }

	// NOTE: Request is recieved in User_routes.py
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(`/assessment_task?course_id=${chosenCourse["course_id"]}`, "assessment_tasks", this);
        genericResourceGET(`/role`, "role", this);
        genericResourceGET(`/rubric`, "rubric", this);        

    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            assessment_tasks,
            role, 
            rubric
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
        } else if (!isLoaded || !assessment_tasks || !role || !rubric) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            var navbar = this.props.navbar;

            navbar.studentViewAssessmentTask = {};
            navbar.studentViewAssessmentTask.assessment_tasks = assessment_tasks;
            navbar.studentViewAssessmentTask.role_names = parseRoleNames(role);
            navbar.studentViewAssessmentTask.rubric_names = parseRubricNames(rubric);

            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;