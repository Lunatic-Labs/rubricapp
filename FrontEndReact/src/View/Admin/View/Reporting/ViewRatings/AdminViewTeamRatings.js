import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import { API_URL } from '../../../../../App';
// import ViewRatingsDD from './ViewRatingsDD';

class AdminViewTeamRatings extends Component {
  constructor(props) {
    super(props);

    this.state = {
        error: null,
        errorMessage: null,
        isLoaded: false,
        assessmentTasks: null
    }
  }

  componentDidMount() {
    genericResourceGET(`/assessment_task?admin_id=${this.props.chosenCourse["admin_id"]}`, "assessmentTasks", this);
  }

  render() {
    const {
        error,
        errorMessage,
        isLoaded,
        assessmentTasks
    } = this.state;

    if(error) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={error.message}
                />
            </div>
        )

    } else if(errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={errorMessage}
                />
            </div>
        )

    } else if (!isLoaded || !assessmentTasks) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )

    } else {
        return(
            <></>
        )
    }
  }
}

export default AdminViewTeamRatings;