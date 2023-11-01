import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmenTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

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
        genericResourceGET(`/assessment_task?course_id=${this.props.chosenCourse["course_id"]}`, 'assessment_tasks', this);
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
        } else if (!isLoaded || !roles || !rubrics) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewAssessmenTasks
                        navbar={this.props.navbar}
                        chosenCourse={this.props.chosenCourse}
                        assessment_tasks={assessment_tasks}
                        roles={roles}
                        rubrics={rubrics}
                        setNewTab={this.props.setNewTab}
                        setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                        setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentTask;