import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewRatings from './ViewRatings';
import { genericResourceGET } from '../../../../../utility';
import { Box } from '@mui/material';



class AdminViewRatingsDD extends Component {
  constructor(props) {
    super(props);

    this.state = {
        error: null,
        errorMessage: null,
        isLoaded: false,
        completedAssessments: null,
        notFetchedCompletedAssessments: true,
        ratings: null,
    }
  }

  componentDidUpdate() {
    if(this.state.notFetchedCompletedAssessments) {
        // We are assuming there is only one completed assessment to fetch!
        this.setState({
            notFetchedCompletedAssessments: false
        });

        if(this.state.completedAssessments.length > 0) {
            genericResourceGET(`/rating?assessment_task_id=${this.state.completedAssessments[0]["completed_assessment_id"]}`, "ratings", this);

        } else {
            this.setState({
                isLoaded: true,
                ratings: []
            });
        }
    }
  }

  componentDidMount() {
    genericResourceGET(`/completed_assessment?assessment_task_id=${this.props.chosenAssessmentTaskId}`, "completedAssessments", this);
  }

  render() {
    const {
        errorMessage,
        isLoaded,
        ratings
    } = this.state;

    if(errorMessage) {
        return(
            <Box>
                <ErrorMessage
                    fetchedResource={"Completed Assessments"}
                    errorMessage={errorMessage}
                />
            </Box>
        )

    } else if (!isLoaded || !ratings) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )

    } else {
        return(
            <Box>
                <ViewRatings
                    ratings={ratings}
                />
            </Box>
        )
    }
  }
}

export default AdminViewRatingsDD;