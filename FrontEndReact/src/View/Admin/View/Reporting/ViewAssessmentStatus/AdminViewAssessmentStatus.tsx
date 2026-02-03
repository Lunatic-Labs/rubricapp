import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewAssessmentStatus from './ViewAssessmentStatus';
import { genericResourceGET } from '../../../../../utility';
import Loading from '../../../../Loading/Loading';

interface AdminViewAssessmentStatusState {
    errorMessage: any;
    isLoaded: any;
    completedAssessments: any;
    loadedAssessmentId: any;
    categories: any;
    rubrics: any;
    showRatings: boolean;
    showSuggestions: boolean;
    completedByTAs: boolean;
    courseTotalStudents: any;
    csvCreation: any;
    downloadedAssessment: any;
    chosenCategoryId: string;
}

class AdminViewAssessmentStatus extends Component<any, AdminViewAssessmentStatusState> {
    fetchData: any;
    constructor(props: any) {
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
            courseTotalStudents: null,
            csvCreation: null,
            downloadedAssessment: null,
            chosenCategoryId: '',
        }

        this.fetchData = () => {
            var chosenCourse = this.props.navbar.state.chosenCourse;

            if(this.props.chosenAssessmentId !== "") {
                // Fetch completed assessment tasks data for the chosen assessment task
                genericResourceGET(
                    `/completed_assessment?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`,
                    "completed_assessments", this, {dest: "completedAssessments"}
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
                "completed_assessments", this, {dest: "courseTotalStudents"}
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

        // Handle CSV download when csvCreation is populated
        if (this.state.isLoaded && this.state.csvCreation) {
            let fileName = this.props.navbar.state.chosenCourse['course_name'];

            let assessment = this.props.assessmentTasks.find((obj: any) => obj["assessment_task_id"] === this.props.chosenAssessmentId);
            if (assessment) {
                const atName = assessment["assessment_task_name"].split(' ');
                const abbreviationLetters = atName.map((word: any) => word.charAt(0).toUpperCase());
                fileName += '-' + abbreviationLetters.join('');
            }

            fileName += '-aggregates';
            if (this.state.chosenCategoryId) {
                fileName += '-' + this.state.chosenCategoryId.replace(/\s+/g, '_');
            }
            fileName += '.csv';

            const fileData = this.state.csvCreation["csv_data"];
            const blob = new Blob([fileData], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute('download', fileName);
            link.click();

            URL.revokeObjectURL(url);

            this.setState({
                csvCreation: null
            });
        }
    }

    handleExportAggregates = (categoryName: string) => {
        const promise = genericResourceGET(
            `/csv_assessment_export?assessment_task_id=${this.state.loadedAssessmentId}&format=3&category_name=${encodeURIComponent(categoryName)}`,
            "csv_creation",
            this,
            { dest: "csvCreation" }
        );

        promise.then((result: any) => {
            if (result !== undefined && result.errorMessage === null) {
                this.setState({
                    downloadedAssessment: "aggregates",
                    chosenCategoryId: categoryName,
                });
            }
        }).catch(() => {
            this.setState({
                csvCreation: null,
            });
        });
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            completedAssessments,
            categories,
            rubrics,
            showRatings,
            showSuggestions,
            completedByTAs, 
            courseTotalStudents,
        } = this.state;

        if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
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
                        courseTotalStudents={courseTotalStudents}
                        onExportAggregates={this.handleExportAggregates}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;
