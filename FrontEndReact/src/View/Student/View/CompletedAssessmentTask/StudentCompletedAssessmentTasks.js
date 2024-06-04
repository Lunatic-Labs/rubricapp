import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';


class StudentCompletedAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null,
            assessmentTasks: null,
            completedAssessments: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourseID = state.chosenCourse["course_id"];

        genericResourceGET(
            `/assessment_task?course_id=${chosenCourseID}&role_id=5`,
            "assessmentTasks", this
        );
       
        genericResourceGET(
            `/completed_assessment?course_id=${chosenCourseID}`,
            "completedAssessments",
            this
        );
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            completedAssessments,
        } = this.state;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !assessmentTasks || !completedAssessments) {
            return(
                <Loading />
            )

        } else {
            console.log("Completed assessments: ",this.state.completedAssessments)
            return(
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={this.state.completedAssessments}
                        assessmentTasks={this.state.assessmentTasks}
                    />
                </div>
            )
        }
    }
}

export default StudentCompletedAssessmentTasks;