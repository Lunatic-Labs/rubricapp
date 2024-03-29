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
          assessmentTasks: null
      }
    }
  
    componentDidMount() {
      var admin_id = this.props.navbar.state.chosenCourse.admin_id; 

      genericResourceGET(`/assessment_task?admin_id=${admin_id}`, "assessmentTasks", this);
      
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
              <AdminReportTabs
                  navbar={this.props.navbar}
                  assessmentTasks={assessmentTasks}
              />
          )
      }
    }
  }

  export default ReportingDashboard;