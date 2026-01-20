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

        this.state = {
            errorMessage: null,
            isLoaded: false,
            assessmentTasks: null,
            roles: null,
            rubrics: null,
            isViewingAsStudent: false  // Add this state
        }
    }

    componentDidMount() {
        // Check if viewing as student
        const cookies = new Cookies();
        const user = cookies.get('user');
        const isViewingAsStudent = user?.viewingAsStudent || false;
        
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        
        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        );

        genericResourceGET(
            `/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}`, 
            "assessment_tasks", this, {dest: "assessmentTasks"});

        genericResourceGET(`/role?`,'roles', this);

        genericResourceGET(`/rubric?all=${true}`, 'rubrics', this);
        
        // Set the viewing mode in state
        this.setState({ isViewingAsStudent });
    }

    render() {
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

        navbar.adminViewAssessmentTask = {};

        navbar.adminViewAssessmentTask.assessmentTasks = assessmentTasks;

        navbar.adminViewAssessmentTask.roleNames = roles ? parseRoleNames(roles) : [];

        navbar.adminViewAssessmentTask.rubricNames = rubrics ? parseRubricNames(rubrics) : [];

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

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