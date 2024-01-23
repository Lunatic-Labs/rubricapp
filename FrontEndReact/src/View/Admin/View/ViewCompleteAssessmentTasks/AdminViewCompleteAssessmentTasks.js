import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks.js";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility.js';

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            isLoaded: false,
            completed_assessments: null,
            roles: null,
            users: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosen_assessment_task["assessment_task_id"]}`,
            'completed_assessments',
            this
        );
        
        genericResourceGET(
            `/role`,
            'roles',
            this
        );

        if(chosenCourse) {
            genericResourceGET(
                `/user?course_id=${chosenCourse["course_id"]}`,
                'users',
                this
            );
        }
    }
    render() {
        const {
            errorMessage,
            isLoaded,
            completed_assessments,
            roles,
            users
        } = this.state;

        var navbar = this.props.navbar;

        navbar.adminViewCompleteAssessmentTasks = {};
        navbar.adminViewCompleteAssessmentTasks.complete_assessment_tasks = completed_assessments;
        navbar.adminViewCompleteAssessmentTasks.role_names = roles ? parseRoleNames(roles) : [];
        navbar.adminViewCompleteAssessmentTasks.user_names = users ? parseUserNames(users) : [];

        if (errorMessage) {
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
                            navbar={navbar}
                        />
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;
