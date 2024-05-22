import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import AdminReportTabs from './AdminReportTabs';
import Loading from '../../../Loading/Loading';



class ReportingDashboard extends Component {
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
      var courseID = this.props.navbar.state.chosenCourse.course_id;

      genericResourceGET(`/assessment_task?course_id=${courseID}`, "assessmentTasks", this);
      
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