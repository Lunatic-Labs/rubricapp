import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';

/**
 * @description
 * Renders the "Completed Assessments" section for a student/TA.
 * Receives all completed assessments from the parent and filters down
 * to those that are fully done before passing them to the table view.
 *
 * Props:
 *  @prop {object} navbar                      - Navbar instance.
 *  @prop {object} role                        - Object with role_id and role_name.
 *  @prop {Array}  assessmentTasks             - All ATs relevant to this view.
 *  @prop {Array}  filteredCompleteAssessments - CATs that the parent has already
 *                                               filtered for this course/user.
 *
 * State:
 *  @property {string|null} errorMessage - Any errors encountered (not currently
 *                                         set by this component; reserved for
 *                                         future use or upstream errors).
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

    /**
     * @method render
     * @description
     * Filters incoming CATs down to those with done === true and renders
     * the completed assessments table.
     *
     * Networking:
     *  - This component does not perform any fetch/POST itself.
     *    All data comes from props; ViewCompletedAssessmentTasks handles
     *    the POST used when viewing an individual completed assessment.
     */
    render() {
        const { errorMessage } = this.state;  

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
