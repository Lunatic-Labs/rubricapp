import React, { Component } from 'react';
import ViewCompleteTeamAssessmentTasks from "./ViewCompleteTeamAssessmentTasks.js";
import ViewCompleteIndividualAssessmentTasks from "./ViewCompleteIndividualAssessmentTasks.js";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility.js';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';

//

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,                  // Stores any API errors
            isLoaded: false,                    // Loading state for all resources and becomes true when data loads
            completedAssessments: null,        // Array of completed assesment data
            roles: null,                      // Role Definitions for the system
            users: null,                    // User data for name on completed assignment
        }
    }

    componentDidMount() {       // Determine assessment type and fetch appropriate data
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenAssessmentTask = state.chosenAssessmentTask;
        var chosenCourse = state.chosenCourse;

        if (chosenAssessmentTask["unit_of_assessment"]) { 
            // Fetch TEAM assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=team`,
                "completed_assessments",
                this,
                {dest: "completedAssessments"}
            );
        } else {
             //Fetch Indivdual assessments
            genericResourceGET(                        
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=individual`,
                "completed_assessments",
                this,
                {dest: "completedAssessments"}
            );

        }
        genericResourceGET( 
            // Fetch roles definitions
            `/role`,
            'roles',
            this
        );

        if(chosenCourse) {
            genericResourceGET(
                // Fetch users for the course
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
        navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks = completedAssessments;     // All completed submissions Raw assessment data
        navbar.adminViewCompleteAssessmentTasks.roleNames = roles ? parseRoleNames(roles) : [];     // Role ID -> Role Name
        navbar.adminViewCompleteAssessmentTasks.userNames = users ? parseUserNames(users) : [];     // User ID -> Display Name Map

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
                // Show team view (rubric for team) when True = Team assessment
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
                // Show indivdual view (rubrics for indivdual students) False = Indivdual Assessment
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
