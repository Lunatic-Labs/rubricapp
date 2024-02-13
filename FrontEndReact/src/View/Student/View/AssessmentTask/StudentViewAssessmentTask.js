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
            assessment_tasks: null,
            checkin: null,
            rubrics: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        genericResourceGET(`/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}&role_id=5`, "assessment_tasks", this);
        genericResourceGET(`/checkin?course_id=${navbar.state.chosenCourse["course_id"]}`, "checkin", this);
        genericResourceGET(`/rubric`, "rubrics", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessment_tasks,
            checkin,
            rubrics,
        } = this.state;
        
        const role = this.props.role;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded ||!assessment_tasks || !checkin || !rubrics) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            var navbar = this.props.navbar;
            var student_assessments = assessment_tasks.filter((at) => (at.role_id === role.role_id)); // keeps only assessment relevant to this role

            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        role={role}
                        assessment_tasks={student_assessments}
                        checkin={checkin}
                        rubric_names={rubrics ? parseRubricNames(rubrics) : []}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;