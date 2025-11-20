// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import AdminReportTabs from './AdminReportTabs';
import Loading from '../../../Loading/Loading';



class ReportingDashboard extends Component {
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
      var courseID = this.props.navbar.state.chosenCourse.course_id;

      genericResourceGET(`/assessment_task?course_id=${courseID}`, "assessment_tasks", this, {dest: "assessmentTasks"});
      
    }

    render() {
      const {
          errorMessage,
          isLoaded,
          assessmentTasks
      } = this.state;
  
      if(errorMessage) {
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
              <AdminReportTabs
                  navbar={this.props.navbar}
                  assessmentTasks={assessmentTasks}
              />
          )
      }
    }
}

  export default ReportingDashboard;