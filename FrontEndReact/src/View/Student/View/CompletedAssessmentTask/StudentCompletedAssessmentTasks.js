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
            isFiltered: false,
            filteredCATs: null,
        }
    }

    componentDidUpdate(){
        // Pruning irrelavant data.
        if(this.state.completedAssessments && this.state.assessmentTasks && !this.state.isFiltered){
            const ats = new Map();
            for(let i=0; i < this.state.assessmentTasks.length; ++i){
                const at = this.state.assessmentTasks[i];
                ats.set(at.assessment_task_id, at);
            }
            let filteredData = this.state.completedAssessments.filter(cat => {
                const at = ats.get(cat.assessment_task_id);
                return at && cat.done === true;
            });
            this.setState({
                filteredCATs: filteredData,
                isFiltered: true,
            });
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var userRole = this.props.role["role_id"];

        var chosenCourseID = state.chosenCourse["course_id"];

        genericResourceGET(
            `/assessment_task?course_id=${chosenCourseID}`,
            "assessment_tasks", this, {dest: "assessmentTasks"}
        );

        if (userRole === 5) {       // If the user is a student, this returns completed assessments for the student
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}`,
                "completed_assessments", this, {dest: "completedAssessments"}
            );
        } else {            // If the user is a TA, this returns assessments completed by the TA
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}&role_id=${userRole}`, 
                "completed_assessments", this, {dest: "completedAssessments"});
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            completedAssessments,
            isFiltered,
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

        } else if (!isLoaded || !assessmentTasks || !completedAssessments || !isFiltered) {
            return(
                <Loading />
            )

        } else {
            return(
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={this.state.filteredCATs}
                        assessmentTasks={this.state.assessmentTasks}
                    />
                </div>
            )
        }
    }
}

export default StudentCompletedAssessmentTasks;
