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
        assessment_tasks: null
    }
  }

  componentDidMount() {
    genericResourceGET(`/assessment_task?admin_id=${this.props.chosenCourse["admin_id"]}`, "assessment_tasks", this);
  }

  render() {
    const {
        errorMessage,
        isLoaded,
        assessment_tasks
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

    } else if (!isLoaded || !assessment_tasks) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )

    } else {
        return(
            <ViewRatingsDD
                assessment_tasks={assessment_tasks}
                assessment_is_team={parseAssessmentIndividualOrTeam(assessment_tasks)}
            />
        )
    }
  }
}

export default AdminViewRatings;