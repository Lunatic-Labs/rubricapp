import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import Loading from '../../../../Loading/Loading';
import { genericResourceGET } from '../../../../../utility';
import { AssessmentTask } from '../../../../../types/AssessmentTask';

interface AdminViewTeamRatingsProps {
    navbar: any;
    chosenCourse: { admin_id: number | string };
}

interface AdminViewTeamRatingsState {
  error: {message: string} | null;
  errorMessage: string | null;
  isLoaded: boolean;
  assessmentTasks: AssessmentTask[] | null;
}

class AdminViewTeamRatings extends Component<AdminViewTeamRatingsProps, AdminViewTeamRatingsState> {
    constructor(props: AdminViewTeamRatingsProps) {
      super(props);

      this.state = {
          error: null,
          errorMessage: null,
          isLoaded: false,
          assessmentTasks: null
      }
    }

    componentDidMount() {
      genericResourceGET(
          `/assessment_task?admin_id=${this.props.chosenCourse["admin_id"]}`,
          "assessment_tasks", this, {dest: "assessmentTasks"}
      );
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
                      errorMessage={error.message}
                  />
              </div>
          )

      } else if(errorMessage) {
          return(
              <div className='container'>
                  <ErrorMessage
                      errorMessage={errorMessage}
                  />
              </div>
          )

      } else if (!isLoaded || !assessmentTasks) {
          return(
              <Loading />
          )

      } else {
          return(
              <>
              </>
          )
      }
    }
}

export default AdminViewTeamRatings;