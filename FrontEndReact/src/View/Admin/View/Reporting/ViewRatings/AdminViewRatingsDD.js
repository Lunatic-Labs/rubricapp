import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewRatings from './ViewRatings';
import { genericResourceGET } from '../../../../../utility';

class AdminViewRatingsDD extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        errorMessage: null,
        isLoaded: false,
        completed_assessments: null,
        notFetchedCompletedAssessments: true,
        ratings: null,
        loaded_assessment_task_id: this.props.chosen_assessment_task_id
    }
  }

  componentDidUpdate() {
    // if(this.props.chosen_assessment_task_id!==this.state.loaded_assessment_task_id) {
    //     genericResourceGET(`/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task_id}`, "completed_assessments", this);
    // }

    if(this.state.notFetchedCompletedAssessments) {
        // for(var index = 0; index < this.state.completed_assessments.length; index++) {
        //     console.log(this.state.completed_assessments[index]["completed_assessment_id"]);
        // }

        // We are assuming there is only one completed assessment to fetch!
        this.setState({
            notFetchedCompletedAssessments: false
        });

        genericResourceGET(`/rating?assessment_task_id=${this.state.completed_assessments[0]["completed_assessment_id"]}`, "ratings", this);
    }
  }

  componentDidMount() {
    genericResourceGET(`/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task_id}`, "completed_assessments", this);
  }

  render() {
    const {
        error,
        errorMessage,
        isLoaded,
        ratings
    } = this.state;

    if(error) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Completed Assessments"}
                    errorMessage={error.message}
                />
            </div>
        )
    } else if(errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Completed Assessments"}
                    errorMessage={errorMessage}
                />
            </div>
        )
    } else if (!isLoaded || !ratings) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )
    } else {

        return(
            <div className='container'>
                <h1 className="text-center mt-5">Completed Assessments</h1>
                <ViewRatings
                    ratings={ratings}
                />
            </div>
        )
    }
  }
}

export default AdminViewRatingsDD