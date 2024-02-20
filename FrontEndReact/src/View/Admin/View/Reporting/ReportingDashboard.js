import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import AdminReportTabs from './AdminReportTabs';

class ReportingDashboard extends Component {
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
      var admin_id = this.props.navbar.state.chosenCourse.admin_id; 
      genericResourceGET(`/assessment_task?admin_id=${admin_id}`, "assessment_tasks", this);
    }
  
    render() {
      const {
          errorMessage,
          isLoaded,
          assessment_tasks
      } = this.state;
  
      console.log("ReportingDashboard", assessment_tasks);
  
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
              <AdminReportTabs
                  navbar={this.props.navbar}
                  assessment_tasks={assessment_tasks}
              />
          )
      }
    }
  }
  
  export default ReportingDashboard;