import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks";
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            completed_assessment_tasks: null,
            role_names: null,
            user_names: null
        }
    }
    componentDidMount() {
        fetch(API_URL + `/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task["assessment_task_id"]}`)
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        completed_assessment_tasks: result["content"]["completed_assessments"][0]
                    })
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
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
        if(this.props.chosenCourse) {
            fetch(API_URL + `/user?course_id=${this.props.chosenCourse["course_id"]}`)
            .then(res => res.json())
            .then((result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    var user = result['content']['users'][0];
                    var user_names = {};
                    for(var r = 0; r < user.length; r++) {
                        user_names[user[r]["user_id"]] = user[r]["first_name"] + " " + user[r]["last_name"];
                    }
                    this.setState({
                        isLoaded: true,
                        user_names: user_names
                    })
            }},
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            })
        }
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            completed_assessment_tasks,
            role_names,
            user_names
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessment Task"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessment Task"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded) {
            return(
                <div className='container mt-5'>
                    <h1 className='text-center'>Loading...</h1>
                </div>
            )
        } else {
            return(
                <>
                    <div className='container'>
                        <h1 className='mt-5'>View Completed Assessment Tasks</h1>
                        <ViewCompleteAssessmentTasks
                            setViewCompleteAssessmentTaskTabWithAssessmentTask={this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask}
                            complete_assessment_tasks={completed_assessment_tasks ? completed_assessment_tasks: []}
                            role_names={role_names}
                            user_names={user_names}
                            chosen_assessment_task={this.props.chosen_assessment_task}
                        />
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;