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
            error: null,
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
            error,
            errorMessage,
            isLoaded,
            assessment_tasks,
            roles,
            rubrics
        } = this.state;
        var navbar = this.props.navbar;
        navbar.adminViewAssessmentTask = {};
        navbar.adminViewAssessmentTask.assessment_tasks = assessment_tasks;
        navbar.adminViewAssessmentTask.role_names = role_names;
        navbar.adminViewAssessmentTask.rubric_names = rubric_names;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !assessment_tasks || !role_names || !rubric_names) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (this.props.show === "AdminAddAssessmentTask") {
            return (
                <AdminAddAssessmentTask
                    navbar={this.props.navbar}
                    chosenCourse={this.props.navbar.state.chosenCourse}
                    assessment_task={this.props.navbar.state.assessment_task}
                    addAssessmentTask={this.props.navbar.state.addAssessmentTask}
                    roles={parseRoleNames(roles)}
                    rubrics={parseRubricNames(rubrics)}
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