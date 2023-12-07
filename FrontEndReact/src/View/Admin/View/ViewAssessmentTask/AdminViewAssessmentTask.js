import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmenTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';

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
        fetch(API_URL + `/assessment_task?course_id=${this.props.chosenCourse["course_id"]}`)
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
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    {/*  NOTE: SKIL-161 Edited here with page destination  */}
                    <ViewAssessmenTasks
                        chosenCourse={this.props.chosenCourse}
                        assessment_tasks={assessment_tasks}
                        role_names={role_names}
                        rubric_names={rubric_names}
                        setNewTab={this.props.setNewTab}
                        setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                        setConfirmCurrentTeam={this.props.setConfirmCurrentTeam}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentTask;
