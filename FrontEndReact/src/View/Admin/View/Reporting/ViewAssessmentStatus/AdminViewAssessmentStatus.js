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
            completedAssessments: null,
            assessmentTasks: null
        }
    }

    componentDidMount() {
        genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "completedAssessments", this);
        genericResourceGET(`/assessment_task?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "assessmentTasks", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completedAssessments, 
            assessmentTasks
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

        } else if (!isLoaded || !completedAssessments || !assessmentTasks) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )

        } else {
            return(
                <div className='container'>
                    <ViewAssessmentStatus
                        completedAssessments={completedAssessments}
                        assessmentTasks={assessmentTasks}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;