import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            completed_assessments: null,
            roles: null,
            users: null
        }
    }
    componentDidMount() {
        genericResourceGET(`/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task["assessment_task_id"]}`,
            'completed_assessments', this);
        
        genericResourceGET(`/role`, 'roles', this);
        // We need to custom update the role_names
        // var role = result['content']['roles'][0];
        // var role_names = {};
        // for(var r = 3; r < role.length; r++) {
        //     role_names[role[r]["role_id"]] = role[r]["role_name"];
        // }
        // this.setState({
        //     isLoaded: true,
        //     role_names: role_names
        // })
   
        if(this.props.chosenCourse) {
            // We need to custom update the user_names
            // var user = result['content']['users'][0];
            // var user_names = {};
            // for(var r = 0; r < user.length; r++) {
            //     user_names[user[r]["user_id"]] = user[r]["first_name"] + " " + user[r]["last_name"];
            // }
            // this.setState({
            //     isLoaded: true,
            //     user_names: user_names
            // })
            genericResourceGET(`/user?course_id=${this.props.chosenCourse["course_id"]}`, 'users', this);
        }
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            completed_assessments,
            roles,
            users
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
        } else if (!isLoaded || !completed_assessments || !roles || !users) {
            return(
                <div className='container mt-5'>
                    <h1 className='text-center'>Loading...</h1>
                </div>
            )
        } else {
            console.log(completed_assessments);
            return(
                <>
                    <div className='container'>
                        <h1 className='mt-5'>View Completed Assessment Tasks</h1>
                        <ViewCompleteAssessmentTasks
                            setViewCompleteAssessmentTaskTabWithAssessmentTask={this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask}
                            complete_assessments={completed_assessments}
                            role_names={roles}
                            user_names={users}
                            chosen_assessment_task={this.props.chosen_assessment_task}
                        />
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;