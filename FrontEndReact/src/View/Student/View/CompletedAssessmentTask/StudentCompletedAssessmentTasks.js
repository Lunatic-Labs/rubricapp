import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';


class StudentCompletedAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null,
            completedAssessments: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(
            `/completed_assessment?course_id=${chosenCourse["course_id"]}`,
            "completedAssessments",
            this
        );
    }

    render() {
        
        const {
            errorMessage,
            isLoaded,
            teams,
            users,
            completedAssessments,
        } = this.state;
        console.log(completedAssessments)
        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
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
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={completedAssessments}
                    />
                </div>
            )
        }
    }
}

export default StudentCompletedAssessmentTasks;