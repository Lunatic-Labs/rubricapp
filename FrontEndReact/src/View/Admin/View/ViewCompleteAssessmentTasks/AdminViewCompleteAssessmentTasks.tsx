import React, { Component } from 'react';
import ViewCompleteTeamAssessmentTasks from "./ViewCompleteTeamAssessmentTasks";
import ViewCompleteIndividualAssessmentTasks from "./ViewCompleteIndividualAssessmentTasks";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading';

interface AdminViewCompleteAssessmentTasksState {
    errorMessage: any;
    isLoaded: boolean;
    completedAssessments: any;
    roles: any;
    users: any;
}

// Fetches all necessary data and decides which child component to display //
class AdminViewCompleteAssessmentTasks extends Component<any, AdminViewCompleteAssessmentTasksState> {
    constructor(props: any) {   // Initializes components with empty state before data fetching begins
        super(props);   // Props passed from parent component containing navbar object with application state

        this.state = {
            errorMessage: null,             // Stores errors messages from failed API calls; null when no errors
            isLoaded: false,                // Becomes true when all data loads
            completedAssessments: null,     // will store array of completed assessment submissions this will be null until fetched
            roles: null,                    // will store array of role definitions will be null until fetch (admin, student)
            users: null,                    // this will store array of users enrolled in the course
        }
    }

    componentDidMount() {                   // Executes once immediately after component mounts to fetch all necessary data from backend
        var navbar = this.props.navbar;     // Navigation object from props containing application state and methods
        var state = navbar.state;           //application state extracted from navbar
        var chosenAssessmentTask = state.chosenAssessmentTask;      // Specific assessment/rubric being viewed, contains assessment_task_id
        var chosenCourse = state.chosenCourse;
        // Determines assessment type and fetch appropriate data
        if (chosenAssessmentTask["unit_of_assessment"]) {
            // Fetch Team assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=team`,
                "completed_assessments", //identifier for error messages
                this,       //reference to current component for setState
                {dest: "completedAssessments"}      // specifies which state property to update
            );
        } else {
            // Fetch Individual assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=individual`,
                "completed_assessments",
                this,
                {dest: "completedAssessments"}
            );

        }
        genericResourceGET(
            // Fetch role definitions (for user role mapping)
            `/role`,    //Endpoint URL with no parameters
            'roles',    //identifier for error messages
            this
        );

        if(chosenCourse) {
            genericResourceGET(
                // Fetch users enrolled in the current course maps user IDs to display names
                `/user?course_id=${chosenCourse["course_id"]}`, // endpoint with course filter
                'users',
                this
            );
        }
    }
    render() {              // Renders the component UI based on current state it shows error and appropriate child components
        const {             // ES6 destructuring - extracts all state properties into local constants for cleaner code access
            errorMessage,
            isLoaded,
            completedAssessments,
            roles,
            users
        } = this.state;

        var navbar = this.props.navbar;     //navigation object from props containing application state and methods
        var unitOfAssessment = navbar.state.chosenAssessmentTask["unit_of_assessment"];     //render team assessment if true, if false renders Individual assessments

        navbar.adminViewCompleteAssessmentTasks = {};
        navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks = completedAssessments; // stores Raw assessment data
        navbar.adminViewCompleteAssessmentTasks.roleNames = roles ? parseRoleNames(roles) : []; // converts Role array into ID to name map object
        navbar.adminViewCompleteAssessmentTasks.userNames = users ? parseUserNames(users) : []; // User ID -> Display name map

        if (errorMessage) {     // Displays user-friendly error message when data fetching fails
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !completedAssessments || !roles || !users) {       // Displays loading spinner while fetching data from backend 
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
                                completedAssessment={completedAssessments} // Raw assessment data array
                            />
                        </Box>
                    </>
                )
            } else {
                // Show Individual view (rubric for Individual student) False = Individual assessment
                return(
                    <>
                        <Box>
                            <ViewCompleteIndividualAssessmentTasks
                                navbar={navbar} //contains navbar.state.chosenAssessmentTask, navbar.state.chosenCourse, navbar.adminViewCompleteAssessmenttask.rolename,userNames
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
