import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewAssessmentStatus from './ViewAssessmentStatus';
import { genericResourceGET } from '../../../../../utility';



class AdminViewAssessmentStatus extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: null,
            completedAssessments: null,
            loadedAssessmentId: this.props.chosenAssessmentId,
            categories: null,
            rubrics: null,
        }

        this.fetchData = () => {
            // Fetch completed assessment tasks data for the chosen assessment task
            genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`, 
            "completedAssessments", this);

            // Iterate through the already-existing list of all ATs to find the rubric_id of the chosen AT
            var rubric_id = 1; 
            for (var i = 0; i < this.props.assessmentTasks.length; i++) {
                if (this.props.assessmentTasks[i]['assessment_task_id'] === this.props.chosenAssessmentId) {
                    rubric_id = this.props.assessmentTasks[i]['rubric_id'];
                    break; 
                }
            }

            // Fetch rubric data to get suggestions and characteristics data
            genericResourceGET(`/rubric?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}&rubric_id=${rubric_id}`, 
            "rubrics", this);

            // Fetch the category names of the appropriate rubric 
            genericResourceGET(`/category?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}&rubric_id=${rubric_id}`, 
            "categories", this);

            this.setState({
                loadedAssessmentId: this.props.chosenAssessmentId,
            });
        }
    }

    componentDidMount() {
        this.fetchData(); 
    }

    componentDidUpdate() {
        if (this.props.chosenAssessmentId !== this.state.loadedAssessmentId) {
            this.fetchData(); 
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completedAssessments,
            categories, 
            rubrics,
        } = this.state;

        console.log("rubrics", rubrics);
        console.log("completedAssessments", completedAssessments);
        console.log("this.props.assessmentTasks", this.props.assessmentTasks);
        console.log("this.props.chosenAssessmentId", this.props.chosenAssessmentId);

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !completedAssessments || !categories || !rubrics){
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )

        } else {
            return(
                <div className='container'>
                    <ViewAssessmentStatus
                        completedAssessments={completedAssessments}
                        // categories={categories}
                        rubrics={rubrics}
                        assessmentTasks={this.props.assessmentTasks}
                        chosenAssessmentId={this.props.chosenAssessmentId}
                        setChosenAssessmentId={this.props.setChosenAssessmentId}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;