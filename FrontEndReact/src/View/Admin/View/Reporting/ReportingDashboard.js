import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import AdminReportTabs from './AdminReportTabs';
import Loading from '../../../Loading/Loading';

// Top-level container for the admin reporting dashboard. This fetches assessment task data and passess it down to child components. Acts as the data
//provide for the enrire interface

class ReportingDashboard extends Component {
    constructor(props) {
      super(props);
        //Initialize state for data fetching
      this.state = {
          error: null,                  //Error object from fetch failures
          errorMessage: null,           //String error messages
          isLoaded: false,              //Loading state flag
          assessmentTasks: null         //Will store array of assessment tasks
      }
    }
    componentDidMount() {
        //Extract course ID from navbar state
      var courseID = this.props.navbar.state.chosenCourse.course_id;
        // API response key and componet reference
      genericResourceGET(`/assessment_task?course_id=${courseID}`, "assessment_tasks", this, {dest: "assessmentTasks"});
      
    }
    // Fetchs all assessment tasks for this course to populate assessment status view and rating and feedback view
    render() {
      const {
          errorMessage,
          isLoaded,
          assessmentTasks
      } = this.state;
      //Render case 1: error occurs during fetch
      if(errorMessage) {
          return(
              <div className='container'>
                  <ErrorMessage
                      fetchedResource={"Assessment Tasks"}
                      errorMessage={errorMessage}
                  />
              </div>
          )
                //Render case 2: still loading data
      } else if (!isLoaded || !assessmentTasks) {
          return(
            <Loading />
          )
                //Render case 3: Data loaded successfully
                //Pass assessment task to AdiminReportTab which handles tab routing
      } else {
          return(
              <AdminReportTabs
                  navbar={this.props.navbar}            //pass navbar reference down
                  assessmentTasks={assessmentTasks}     //Pass fetched assessment tasks
              />
          )
      }
    }
  }

  export default ReportingDashboard;