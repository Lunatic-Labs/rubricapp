import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewRatingsDD from './ViewRatingsDD';
import { genericResourceGET, parseAssessmentIndividualOrTeam } from '../../../../../utility';



class AdminViewRatings extends Component {
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
        errorMessage,
        isLoaded,
        assessmentTasks
    } = this.state;

    if(errorMessage) {
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
            <ViewRatingsDD
                assessmentTasks={assessmentTasks}
                assessmentIsTeam={parseAssessmentIndividualOrTeam(assessmentTasks)}
            />
        )
    }
  }
}

export default AdminViewRatings;