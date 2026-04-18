import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import AdminReportTabs from './AdminReportTabs';
import Loading from '../../../Loading/Loading';
import { AssessmentTask } from '../../../../types/AssessmentTask';

interface ReportingDashboardProps {
    navbar: any;
}

interface ReportingDashboardState {
    error: { message: string } | null;
    errorMessage: string | null;
    isLoaded: boolean;
    assessmentTasks: AssessmentTask[] | null;
}

class ReportingDashboard extends Component<ReportingDashboardProps, ReportingDashboardState> {
    constructor(props: ReportingDashboardProps) {
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
              <AdminReportTabs
                  navbar={this.props.navbar}
                  assessmentTasks={assessmentTasks}
              />
          )
      }
    }
}

  export default ReportingDashboard;