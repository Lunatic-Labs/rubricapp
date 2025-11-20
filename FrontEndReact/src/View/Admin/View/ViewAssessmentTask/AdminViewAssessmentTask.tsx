// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility.js';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';



class AdminViewAssessmentTask extends Component {
    props: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            assessmentTasks: null,
            roles: null,
            rubrics: null
        }
    }

    componentDidMount() {
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
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            roles,
            rubrics,
            teams
        } = this.state;

        var navbar = this.props.navbar;

        navbar.adminViewAssessmentTask = {};

        navbar.adminViewAssessmentTask.assessmentTasks = assessmentTasks;

        navbar.adminViewAssessmentTask.roleNames = roles ? parseRoleNames(roles) : [];

        navbar.adminViewAssessmentTask.rubricNames = rubrics ? parseRubricNames(rubrics) : [];

        if(errorMessage) {
            return(
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )

        } else if (!isLoaded || !assessmentTasks || !roles || !rubrics || !teams) {
            return(
                <Loading />
            )

        } else if (this.props.show === "AdminAddAssessmentTask") {
            return (
                <AdminAddAssessmentTask
                    navbar={navbar}
                />
            )

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