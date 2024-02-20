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
        }
    }

    componentDidMount() {
        genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "completed_assessments", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completed_assessments, 
        } = this.state;

        // console.log("AdminViewAssessmentStatus", this.props.navbar);

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !completed_assessments){
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
                        assessment_tasks={this.props.assessment_tasks}
                        chosen_assessment_id={this.props.chosen_assessment_id}
                        set_chosen_assessment_id={this.props.set_chosen_assessment_id}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;