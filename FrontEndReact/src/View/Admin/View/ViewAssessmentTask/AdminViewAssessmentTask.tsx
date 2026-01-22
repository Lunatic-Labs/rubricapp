import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading';
import Cookies from 'universal-cookie';

interface AdminViewAssessmentTaskState {
    errorMessage: any;
    isLoaded: boolean;
    assessmentTasks: any;
    roles: any;
    rubrics: any;
    teams?: any;
    isViewingAsStudent: boolean;
}

class AdminViewAssessmentTask extends Component<any, AdminViewAssessmentTaskState> {
    constructor(props: any) {
        super(props);

        //Intialize component state
        this.state = {
            errorMessage: null,         //Stores API error messages
            isLoaded: false,            // Loading state true when all API calls complete
            assessmentTasks: null,      //Array of assessment taks for the course
            roles: null,                //Array of system role definitions
            rubrics: null,               // Array fo all available rubrics
            isViewingAsStudent: false  // Add this state
        }
    }

     //Fetches all necessary data when component first loads
     //API 4 calls made: Fetches teams for the course, fetch assessment tasks for the course, fetch all system roles, fetch all rubrics

    componentDidMount() {
        //Extract data from props       
        // Check if viewing as student
        const cookies = new Cookies();
        const user = cookies.get('user');
        const isViewingAsStudent = user?.viewingAsStudent || false;
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
        
        // Set the viewing mode in state
        this.setState({ isViewingAsStudent });
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
            teams,
            isViewingAsStudent  // Get from state
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

        } else if (this.props.show === "AdminAddAssessmentTask" && !isViewingAsStudent) {
            // Only show Add Assessment Task if NOT viewing as student
            return (
                <AdminAddAssessmentTask
                    navbar={navbar}
                />
            )

            //RENDER PATH 4: View assessment Tasks Mode 
            //Shows table of existing assessemtn tasks

        } else {
            // Pass the viewing mode to ViewAssessmentTasks
            return(
                <Box>
                    <ViewAssessmentTasks
                        navbar={navbar}
                        teams={teams}
                        isViewingAsStudent={isViewingAsStudent}  // Pass as prop
                    />
                </Box>
            )
        }
    }
}

export default AdminViewAssessmentTask;