import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmenTasks from './ViewAssessmentTasks';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseRoleNames, parseRubricNames } from '../../../../utility';
import AdminAddAssessmentTask from '../../Add/AddTask/AdminAddAssessmentTask';

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
        genericResourceGET(`/assessment_task?course_id=${this.props.navbar.state.chosenCourse["course_id"]}`, 'assessment_tasks', this);
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
        } else if (!isLoaded || !assessment_tasks || !roles || !rubrics) {
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
                <div className='container'>
                    <ViewAssessmenTasks
                        navbar={this.props.navbar}
                        chosenCourse={this.props.navbar.state.chosenCourse}
                        assessment_tasks={assessment_tasks}
                        roles={parseRoleNames(roles)}
                        rubrics={parseRubricNames(rubrics)}
                        setNewTab={this.props.navbar.state.setNewTab}
                        setAddAssessmentTaskTabWithAssessmentTask={this.props.navbar.state.setAddAssessmentTaskTabWithAssessmentTask}
                        setCompleteAssessmentTaskTabWithID={this.props.navbar.state.setCompleteAssessmentTaskTabWithID}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentTask;