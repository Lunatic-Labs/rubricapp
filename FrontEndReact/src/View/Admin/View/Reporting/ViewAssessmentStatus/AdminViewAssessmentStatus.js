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
            loadedAssessmentId: null,
        }
    }

    componentDidMount() {
        genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`, 
        "completedAssessments", this);
    }

    componentDidUpdate() {
        if (this.props.chosenAssessmentId !== this.state.loadedAssessmentId) {
            genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`, 
            "completedAssessments", this);
            this.state.loadedAssessmentId = this.props.chosenAssessmentId; 
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completedAssessments,
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
        } else if (!isLoaded || !completedAssessments){
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
                        assessmentTasks={this.props.assessmentTasks}
                        chosenAssessmentId={this.props.chosenAssessmentId}
                        setChosenAssessmentId={this.props.setChosenAssessmentId}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;