import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewAssessmentStatus from './ViewAssessmentStatus';
import { genericResourceGET } from '../../../../../utility';



class AdminViewAssessmentStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: null,
            completed_assessments: null,
            assessment_tasks: null
        }
    }

    componentDidMount() {
        genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "completed_assessments", this);
        genericResourceGET(`/assessment_task?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "assessment_tasks", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completed_assessments, 
            assessment_tasks
        } = this.state;

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !completed_assessments || !assessment_tasks) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewAssessmentStatus
                        completed_assessments={completed_assessments}
                        assessment_tasks={assessment_tasks}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;