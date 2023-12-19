import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import { Box } from '@mui/material';

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            assessment_tasks: null,
            role_names: null,
            rubric_names: null
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        fetch(API_URL + `/assessment_task?course_id=${chosenCourse["course_id"]}`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    assessment_tasks: result['content']['assessment_tasks'][0]
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
        fetch(API_URL + `/role`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                var role = result['content']['roles'][0];
                var role_names = {};
                for(var r = 3; r < role.length; r++) {
                    role_names[role[r]["role_id"]] = role[r]["role_name"];
                }
                this.setState({
                    isLoaded: true,
                    role_names: role_names
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
        fetch(API_URL + `/rubric`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                var rubric = result['content']['rubrics'][0];
                var rubric_names = {};
                for(var r = 0; r < rubric.length; r++) {
                    rubric_names[rubric[r]["rubric_id"]] = rubric[r]["rubric_name"];
                }
                this.setState({
                    isLoaded: true,
                    rubric_names: rubric_names
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            assessment_tasks,
            role_names,
            rubric_names
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