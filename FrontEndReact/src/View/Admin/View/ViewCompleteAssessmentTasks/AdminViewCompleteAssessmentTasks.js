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
        const { error, errorMessage, isLoaded, complete_assessment_tasks} = this.state;
        console.log(complete_assessment_tasks);
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
                        <ViewCompleteAssessmentTasks/>
                    </div>
                </>
            )
        }
    }
}

export default AdminViewCompleteAssessmentTasks;