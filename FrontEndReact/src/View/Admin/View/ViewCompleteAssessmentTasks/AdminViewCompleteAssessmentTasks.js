import React, { Component } from 'react';
import ViewCompleteTeamAssessmentTasks from "./ViewCompleteTeamAssessmentTasks.js";
import ViewCompleteIndividualAssessmentTasks from "./ViewCompleteIndividualAssessmentTasks.js";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility.js';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';

// Fetches all necessary data and decided which child component to display //

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,             // Stores an API errors
            isLoaded: false,                // Becomes true when all data loads
            completedAssessments: null,     // The submissions from submissions
            roles: null,                    // User role information (admin, student)
            users: null,                    // User name for displaying who submitted
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenAssessmentTask = state.chosenAssessmentTask;
        var chosenCourse = state.chosenCourse;
        // Determines assessment type and fetch appropriate data
        if (chosenAssessmentTask["unit_of_assessment"]) {
            // Fetch Team assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=team`,
                "completed_assessments",
                this,
                {dest: "completedAssessments"}
            );
        } else {
            // Fetch Indivdual assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=individual`,
                "completed_assessments",
                this,
                {dest: "completedAssessments"}
            );

        }
        genericResourceGET(
            // Fetch role definitions (for user role mapping)
            `/role`,
            'roles',
            this
        );

        if(chosenCourse) {
            genericResourceGET(
                // Fetch users for the course (for name lookup)
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
        navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks = completedAssessments; // Raw assessment data
        navbar.adminViewCompleteAssessmentTasks.roleNames = roles ? parseRoleNames(roles) : []; // Role ID -> Role name map
        navbar.adminViewCompleteAssessmentTasks.userNames = users ? parseUserNames(users) : []; // USer ID -> Display name map

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
                // Show team view (rubric for teams) True = Team Assessment
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
                // Show Indivdual view (rubric for indivdual student) False = Indivdual assessment
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
