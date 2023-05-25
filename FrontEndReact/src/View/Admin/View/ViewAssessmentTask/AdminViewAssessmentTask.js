import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmenTasks from './ViewAssessmentTasks';

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            assessment_tasks: null
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/assessment_task")
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
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            assessment_tasks
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { error.message }</h1>
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching users resulted in an error: { errorMessage }</h1>
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
                    <ViewAssessmenTasks
                        course={this.props.course}
                        assessment_tasks={assessment_tasks}
                        setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                        setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentTask;