// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import Loading from '../../../../Loading/Loading';
import { genericResourceGET } from '../../../../../utility.js';



class AdminViewTeamRatings extends Component {
    props: any;
    state: any;
    constructor(props: any) {
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
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='container'>
                  <ErrorMessage
                      fetchedResource={"Assessment Tasks"}
                      errorMessage={error.message}
                  />
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              </div>
          )

      } else if(errorMessage) {
          return(
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
              <div className='container'>
                  <ErrorMessage
                      fetchedResource={"Assessment Tasks"}
                      errorMessage={errorMessage}
                  />
              // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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