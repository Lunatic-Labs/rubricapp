import React, { Component } from 'react';
import ViewCompleteTeamAssessmentTasks from "./ViewCompleteTeamAssessmentTasks.js";
import ViewCompleteIndividualAssessmentTasks from "./ViewCompleteIndividualAssessmentTasks.js";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility.js';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';



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

        if (chosenAssessmentTask["unit_of_assessment"]) {
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=team`,
                "completedAssessments",
                this
            );
        } else {
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=individual`,
                "completedAssessments",
                this
            );

        }
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
        var unitOfAssessment = navbar.state.chosenAssessmentTask["unit_of_assessment"];

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
                <Loading />
            )

        } else {
            if (unitOfAssessment) {
                return(
                    <>
                        <Box>
                            <ViewCompleteTeamAssessmentTasks
                                navbar={navbar}
                                completedAssessment={completedAssessments}
                            />
                        </Box>
                    </>
                )
            } else {
                return(
                    <>
                        <Box>
                            <ViewCompleteIndividualAssessmentTasks
                                navbar={navbar}
                                completedAssessment={completedAssessments}
                            />
                        </Box>
                    </>
                )
            }
        }
    }
}

export default AdminViewCompleteAssessmentTasks;
