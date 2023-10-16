import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../Error/ErrorMessage';
import { genericResourceFetch } from '../../../utility';

class StudentViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            assessment_tasks: null,
            rubrics: null
        }
        this.handleGetResource.bind(this);
    }
    async handleGetResource(url, resource) {
        await genericResourceFetch(
            url,
            resource,
            this
        );
    }
    componentDidMount() {
        this.handleGetResource(
            `/assessment_task?course_id=${this.props.chosenCourse["course_id"]}`,
            "assessment_tasks",
        );
        this.handleGetResource(
            `/rubric?`,
            "rubrics"
        )
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            assessment_tasks,
            rubrics
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
        } else if (!isLoaded || !rubrics) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewAssessmentTasks
                        chosenCourse={this.props.chosenCourse}
                        assessment_tasks={assessment_tasks}
                        rubrics={rubrics}
                        setNewTab={this.props.setNewTab}
                        setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                        setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                        setViewCompleteAssessmentTaskTabWithAssessmentTask={this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask}
                    />
                </div>
            )
        }
    }
}

export default StudentViewAssessmentTask;