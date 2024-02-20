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
        ratings: null,
    }
  }

  componentDidMount() {
    genericResourceGET(`/rating?assessment_task_id=${this.props.chosenAssessmentId}`, "ratings", this);
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
                    fetchedResource={"Ratings"}
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
                />
              </Box>
            </>
            
        )
    }
  }
}

export default AdminViewRatings;