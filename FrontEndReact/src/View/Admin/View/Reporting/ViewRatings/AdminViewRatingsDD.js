import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewRatings from './ViewRatings';
import { API_URL } from '../../../../../App';

class AdminViewRatingsDD extends Component {
  constructor(props) {
      super(props);
      this.state = {
          error: null,
          errorMessage: null,
          isLoaded: false,
          completed_assessments: null,
          notFetchedCompletedAssessments: true,
          fetchedRatings: null
      }
  }

  componentDidUpdate() {
    if(this.state.notFetchedCompletedAssessments) {
        // for(var index = 0; index < this.state.completed_assessments.length; index++) {
        //     console.log(this.state.completed_assessments[index]["completed_assessment_id"]);
        // }
      // We are assuming there is only one completed assessment to fetch!
      fetch(API_URL + `/rating?assessment_task_id=${this.state.completed_assessments[0]["completed_assessment_id"]}`)
      .then(res => res.json())
      .then(
          (result) => {
              if(result["success"]===false) {
                  this.setState({
                      isLoaded: true,
                      errorMessage: result["message"]
                  })
              } else {
                  this.setState({
                      isLoaded: true,
                      fetchedRatings: result['content']['ratings'][0]
                  })
              }
          },
          (error) => {
              this.setState({
                  isLoaded: true,
                  error: error
              })
          }
      )
        this.setState({
            notFetchedCompletedAssessments: false
        });   
    }
  }

  componentDidMount() {
      fetch(API_URL + `/completed_assessment?assessment_task_id=${this.props.chosen_assessment_task_id}`)
      .then(res => res.json())
      .then(
          (result) => {
              if(result["success"]===false) {
                  this.setState({
                      isLoaded: true,
                      errorMessage: result["message"]
                  })
              } else {
                  this.setState({
                      isLoaded: true,
                      completed_assessments: result['content']['completed_assessments'][0]
                  })
              }
          },
          (error) => {
              this.setState({
                  isLoaded: true,
                  error: error
              })
          }
      )
  }
  render() {
    const {
        error,
        errorMessage,
        isLoaded,
        fetchedRatings
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
    } else if (!isLoaded || !fetchedRatings) {
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
                    ratings={fetchedRatings}
                />
            </div>
        )
    }
  }
}

export default AdminViewRatingsDD