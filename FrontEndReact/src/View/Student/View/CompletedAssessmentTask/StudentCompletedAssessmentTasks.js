import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';

/**
 * @description Renders the complete assessment section of the website.
 * 
 * @prop {object} navbar - Passed navbar.
 * @prop {object} role - Object with role_id and role_name.
 * @prop {object} assessmentTasks - ATs.
 * @prop {object} filteredCompleteAssessments - Filtered CATs.
 * 
 * @property {object} errorMessage - Any errors encountered.
 * 
 */

class StudentCompletedAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
        }
    }

    render() {
        const {errorMessage} = this.state;  

        const ATs = this.props.assessmentTasks;
        const filteredCATs = this.props.filteredCompleteAssessments;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else {
            return(
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={filteredCATs}
                        assessmentTasks={ATs}
                    />
                </div>
            ) 
        }
    }
}

export default StudentCompletedAssessmentTasks;
