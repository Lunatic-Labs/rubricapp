import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';

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

interface StudentCompletedAssessmentTasksProps {
    navbar: any;
    assessmentTasks: any[];
    filteredCompleteAssessments: any[];
}

interface StudentCompletedAssessmentTasksState {
    errorMessage: string | null;
}

class StudentCompletedAssessmentTasks extends Component<StudentCompletedAssessmentTasksProps, StudentCompletedAssessmentTasksState> {
    constructor(props: StudentCompletedAssessmentTasksProps) {
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
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else {
            return(
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={doneCATs}
                        assessmentTasks={ATs}
                    />
                </div>
            ) 
        }
    }
}

export default StudentCompletedAssessmentTasks;
