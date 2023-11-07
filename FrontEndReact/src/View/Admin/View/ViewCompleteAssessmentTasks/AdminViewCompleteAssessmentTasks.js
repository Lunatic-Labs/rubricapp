import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility';

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            completed_assessments: null,
            roles: null,
            users: null
        }
    }
    componentDidMount() {
        genericResourceGET(
            `/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task["assessment_task_id"]}`,
            'completed_assessments',
            this
        );
        
        genericResourceGET(
            `/role`,
            'roles',
            this
        );
        if(this.props.chosenCourse) {
            genericResourceGET(
                `/user?course_id=${this.props.chosenCourse["course_id"]}`,
                'users',
                this
            );
        }
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            completed_assessments,
            roles,
            users
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessment Task"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !completed_assessments || !roles || !users) {
            return(
                <div className='container mt-5'>
                    <h1 className='text-center'>Loading...</h1>
                </div>
            )
        } else {
            return(
                <>
                    <div className='container'>
                        <h1 className='mt-5'>View Completed Assessment Tasks</h1>
                        <ViewCompleteAssessmentTasks
                            navbar={this.props.navbar}
                            complete_assessments={completed_assessments}
                            roles={parseRoleNames(roles)}
                            users={parseUserNames(users)}
                            chosen_assessment_task={this.props.chosen_assessment_task}
                        />
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;