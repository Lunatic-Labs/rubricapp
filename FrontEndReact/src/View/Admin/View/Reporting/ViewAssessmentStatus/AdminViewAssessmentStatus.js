import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewAssessmentStatus from './ViewAssessmentStatus';
import { genericResourceGET } from '../../../../../utility';
import Loading from '../../../../Loading/Loading';



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
            showRatings: true,
            showSuggestions: true,
            completedByTAs: true, 
            completedAssessmentsPercentage: null,
        }

        this.fetchData = () => {
            var chosenCourse = this.props.navbar.state.chosenCourse;

            if(this.props.chosenAssessmentId !== "") {
                // Fetch completed assessment tasks data for the chosen assessment task
                genericResourceGET(
                    `/completed_assessment?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`,
                    "completedAssessments", this
                );
            }

            // Iterate through the already-existing list of all ATs to find the rubric_id of the chosen AT, among other things
            var rubricId = 1;
            var showRatings = true; 
            var showSuggestions = true; 
            var completedByTAs = true; 

            for (var i = 0; i < this.props.assessmentTasks.length; i++) {
                if (this.props.assessmentTasks[i]['assessment_task_id'] === this.props.chosenAssessmentId) {
                    rubricId = this.props.assessmentTasks[i]['rubric_id'];
                    showRatings = this.props.assessmentTasks[i]['show_ratings'];
                    showSuggestions = this.props.assessmentTasks[i]['show_suggestions'];
                    completedByTAs = this.props.assessmentTasks[i]['role_id'] === 4;
                    break;
                }
            }

            // Fetch rubric data to get suggestions and characteristics data
            genericResourceGET(
                `/rubric?admin_id=${chosenCourse["admin_id"]}&rubric_id=${rubricId}`,
                "rubrics", this
            );

            // Fetch the category names of the appropriate rubric 
            genericResourceGET(
                `/category?admin_id=${chosenCourse["admin_id"]}&rubric_id=${rubricId}`,
                "categories", this
            );
            
            // Fetch ratio of users who have completed assessment task to total users in the class
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourse.course_id}&assessment_id=${this.props.chosenAssessmentId}`, 
                "completedAssessmentsPercentage", this
            );

            this.setState({
                loadedAssessmentId: this.props.chosenAssessmentId,
                showRatings: showRatings,
                showSuggestions: showSuggestions,
                completedByTAs: completedByTAs, 
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
        // console.log(this.props);
        console.log(this.state);
        const {
            errorMessage,
            isLoaded,
            completedAssessments,
            categories,
            rubrics,
            showRatings,
            showSuggestions,
            completedByTAs, 
            completedAssessmentsPercentage,
        } = this.state;

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || (!completedAssessments && this.props.chosenAssessmentId !== "") || !categories || !rubrics){
            return(
                <Loading />
            )

        } else {
            return(
                <div className='container'>
                    <ViewAssessmentStatus
                        navbar={this.props.navbar}
                        completedAssessments={completedAssessments}
                        rubrics={rubrics}
                        assessmentTasks={this.props.assessmentTasks}
                        chosenAssessmentId={this.props.chosenAssessmentId}
                        setChosenAssessmentId={this.props.setChosenAssessmentId}
                        showRatings={showRatings}
                        showSuggestions={showSuggestions}
                        completedByTAs={completedByTAs}
                        completedAssessmentsPercentage={completedAssessmentsPercentage}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;
