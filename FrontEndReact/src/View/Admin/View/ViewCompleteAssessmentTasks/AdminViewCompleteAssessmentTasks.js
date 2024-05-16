import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks.js";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility.js';
import { Box, CircularProgress } from '@mui/material';



class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            completedAssessments: null,
            roles: null,
            users: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenAssessmentTask = state.chosenAssessmentTask;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
            "completedAssessments",
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
            completedAssessments,
            roles,
            users
        } = this.state;

        var navbar = this.props.navbar;

        navbar.adminViewCompleteAssessmentTasks = {};
        navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks = completedAssessments;
        navbar.adminViewCompleteAssessmentTasks.roleNames = roles ? parseRoleNames(roles) : [];
        navbar.adminViewCompleteAssessmentTasks.userNames = users ? parseUserNames(users) : [];

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !completedAssessments || !roles || !users) {
            return(
                <div className='container mt-5'>
                    <CircularProgress />
                </div>
            )

        } else {
            return(
                <>
                    <Box>
                        <ViewCompleteAssessmentTasks
                            navbar={navbar}
                        />
                    </Box>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;
