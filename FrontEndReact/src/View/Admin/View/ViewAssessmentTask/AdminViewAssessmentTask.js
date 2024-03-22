import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility.js';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask.js';
import { Box } from '@mui/material';



class AdminViewAssessmentTask extends Component {
    constructor(props) {
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

        genericResourceGET(`/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}`, "assessmentTasks", this);

        genericResourceGET(`/role?`,'roles', this);

        genericResourceGET(`/rubric?`, 'rubrics', this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            roles,
            rubrics
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
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !assessmentTasks || !roles || !rubrics) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
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
                    />
                </Box>
            )
        }
    }
}

export default AdminViewAssessmentTask;