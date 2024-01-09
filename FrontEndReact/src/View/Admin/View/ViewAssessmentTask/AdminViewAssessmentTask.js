import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask';
import { Box } from '@mui/material';

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            isLoaded: false,
            assessment_tasks: null,
            roles: null,
            rubrics: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar; // NOTE: Use this variable extraction.

        genericResourceGET(`/assessment_task?course_id=${navbar.state.chosenCourse["course_id"]}`, 'assessment_tasks', this);
        genericResourceGET(`/role?`,'roles', this);
        genericResourceGET(`/rubric?`, 'rubrics', this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessment_tasks,
            roles,
            rubrics
        } = this.state;

        var navbar = this.props.navbar;
        navbar.adminViewAssessmentTask = {};
        navbar.adminViewAssessmentTask.assessment_tasks = assessment_tasks;
        navbar.adminViewAssessmentTask.role_names = roles ? parseRoleNames(roles) : [];
        navbar.adminViewAssessmentTask.rubric_names = rubrics ? parseRubricNames(rubrics) : [];

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !assessment_tasks || !roles || !rubrics) {
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
