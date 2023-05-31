import React, { Component } from 'react';
import ViewCompleteAssessmentTasks from "./ViewCompleteAssessmentTasks";

class AdminViewCompleteAssessmentTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            complete_assessment_tasks: null
        }
    }
    componentDidMount() {
        // Here will be where we make the fetch request for complete assessment tasks
        this.setState({isLoaded: true});
    }
    render() {
        // const { error, errorMessage, isLoaded, complete_assessment_tasks} = this.state;
        const { error, errorMessage, isLoaded } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <h1 className='text-danger text-center mt-5'>An error occurred fetching completed assessment tasks: { errorMessage }</h1>
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <h1 className='text-danger text-center mt-5'>An error occurred fetching completed assessment tasks: { error.message }</h1>
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
                            complete_assessment_tasks={[[{
                                "completed_assessment_id": 1,
                                "assessment_task_id": 1,
                                "by_role": 1,
                                "team_or_user": true,
                                "team_id": 1,
                                "user_id": null,
                                "initial_time": "2023-05-29:EST09:01:23",
                                "last_update": null,
                                "rating": 0,
                            }]]}
                            chosen_assessment_task={this.props.chosen_assessment_task}
                        />
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;