import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../../utility';
import ViewRatingsHeader from './ViewRatingsHeader';
import ViewRatingsTable from './ViewRatingsTable';
import { Box } from '@mui/material';



class AdminViewRatings extends Component {
  constructor(props) {
    super(props);

    this.state = {
        errorMessage: null,
        isLoaded: null,
        loadedAssessmentId: this.props.chosenAssessmentId,
        ratings: null,
        categories: null,
    }

    this.fetchData = () => {
      var chosenCourse = this.props.navbar.state.chosenCourse;

      // Fetch student ratings for the chosen assessment task
      genericResourceGET(
        `/rating?admin_id=${chosenCourse["admin_id"]}&assessment_task_id=${this.props.chosenAssessmentId}`,
        "ratings", this
      );

      // Iterate through the already-existing list of all ATs to find the rubric_id of the chosen AT
      var rubricId = 1;

      for (var i = 0; i < this.props.assessmentTasks.length; i++) {
        if (this.props.assessmentTasks[i]['assessment_task_id'] === this.props.chosenAssessmentId) {
            rubricId = this.props.assessmentTasks[i]['rubric_id'];
            break; 
        }
      }

      // Fetch the category names of the appropriate rubric 
      genericResourceGET(
        `/category?admin_id=${chosenCourse["admin_id"]}&rubric_id=${rubricId}`,
        "categories", this
      );

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
        ratings,
        categories,
    } = this.state;

    if(errorMessage) {
      return(
        <Box>
            <ErrorMessage
                fetchedResource={"Ratings"}
                errorMessage={errorMessage}
            />
        </Box>
      )

    } else if (!isLoaded || !ratings || !categories) {
      return(
        <div className='container'>
            <h1>Loading...</h1>
        </div>
      )

    } else {
      return(
        <>
          <Box>
            <ViewRatingsHeader
              assessmentTasks={this.props.assessmentTasks}
              chosenAssessmentId={this.props.chosenAssessmentId}
              setChosenAssessmentId={this.props.setChosenAssessmentId}
            />
          </Box>

          <Box>
            <ViewRatingsTable
              assessmentTasks={this.props.assessmentTasks}
              chosenAssessmentId={this.props.chosenAssessmentId}
              setChosenAssessmentId={this.props.setChosenAssessmentId}
              ratings={ratings}
              categories={categories}
            />
          </Box>
        </>
      )
    }
  }
}

export default AdminViewRatings;