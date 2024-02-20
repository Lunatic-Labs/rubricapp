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
        errorMessage: null,
        isLoaded: null,
        ratings: null,
    }
  }

  componentDidMount() {
    genericResourceGET(`/rating?assessment_task_id=${this.props.chosen_assessment_id}`, "ratings", this);
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