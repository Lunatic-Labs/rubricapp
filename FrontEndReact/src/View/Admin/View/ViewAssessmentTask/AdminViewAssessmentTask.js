import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility.js';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask.js';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';



class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);

        //Intialize component state
        this.state = {
            errorMessage: null,         //Stores API error messages
            isLoaded: false,            // Loading state true when all API calls complete
            assessmentTasks: null,      //Array of assessment taks for the course
            roles: null,                //Array of system role definitions
            rubrics: null               // Array fo all available rubrics
        }
    }

     //Fetches all necessary data when component first loads
     //API 4 calls made: Fetches teams for the course, fetch assessment tasks for the course, fetch all system roles, fetch all rubrics

    componentDidMount() {
        //Extract data from props       
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        
        //API call: fetch team for the course
        //GET /team?course_id{id}
        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        );
        //API2 call: fetch assessment taks for the course
        //GET /assessment_task
        genericResourceGET(
            `/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}`, 
            "assessment_tasks", this, {dest: "assessmentTasks"}); //Maps to state.assessmentTasks
            
        //API Call 3 Fetches all system roles
        //Get /role
        genericResourceGET(
            `/role?`,
            'roles', 
            this
        );
        //API call 4: fetch all available rubrics
        genericResourceGET(`/rubric?all=${true}`, 'rubrics', this);
    }

    //Renders appropriate view based on state and props
    // Extracts data from state, Parses roles and rubric into name mapping object
    // Attaches processed data ti navbar for child components
    render() {
        //Extract all state variables using destructuring
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            roles,
            rubrics,
            teams
        } = this.state;

        var navbar = this.props.navbar;

        //Process and attach data to navbar for child components
        navbar.adminViewAssessmentTask = {};
        navbar.adminViewAssessmentTask.assessmentTasks = assessmentTasks;
        //Parse roles: [{role_id: 1, role_name: "Instructor"}] -> {1: "Instructor"}
        navbar.adminViewAssessmentTask.roleNames = roles ? parseRoleNames(roles) : [];
        //Parse roles: [{rubric_id: 1, rubric_name: "Project Rubric"}] -> {1: "Project Rubric"}
        navbar.adminViewAssessmentTask.rubricNames = rubrics ? parseRubricNames(rubrics) : [];

        //Render PATH 1: error state
        // Shows when any API call fails

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

            //Shows while waiting for all PAI calls to complete
            //Checks ALL required data exists befor proceeding

        } else if (!isLoaded || !assessmentTasks || !roles || !rubrics || !teams) {
            return(
                <Loading />
            )

            //Render PATH 3 - adds assessment task mode
            //Shows form for creating new assessment task

        } else if (this.props.show === "AdminAddAssessmentTask") {
            return (
                <AdminAddAssessmentTask
                    navbar={navbar}
                />
            )

            //RENDER PATH 4: View assessment Tasks Mode 
            //Shows table of existing assessemtn tasks

        } else {
            return(
                <Box>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        teams = {teams}
                    />
                </Box>
            )
        }
    }
}

export default AdminViewAssessmentTask;