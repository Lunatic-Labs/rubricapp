// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
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
    props: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
        }
    }

    render() {
        const {errorMessage} = this.state;  

        const ATs = this.props.assessmentTasks;    
        const filteredCATs = this.props.filteredCompleteAssessments;
        const doneCATs = filteredCATs?.filter((cat: any) => cat.done === true) || [];

        if (errorMessage) {
            return(
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )

        } else {
            return(
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={doneCATs}
                        assessmentTasks={ATs}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            ) 
        }
    }
}

export default StudentCompletedAssessmentTasks;
