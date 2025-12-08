import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import Loading from '../../../../Loading/Loading';
import { genericResourceGET } from '../../../../../utility.js';


//Intended to be an admin view for team ratings, but currently incomplete
//Only fetches assessment tasks and renders nothing in the success state
//Fetches assessment tasks on component mount
//Shows loading spinner while fetching, shows error message if fetch fails
class AdminViewTeamRatings extends Component {
  constructor(props) {
    super(props);
    //Initialize state with error tracking and data storage
    this.state = {
        error: null,                //Stores error objects from fetch failures
        errorMessage: null,         //Stores string error messages
        isLoaded: false,            //Tracks whether data has finished loading
        assessmentTasks: null       // Will store array of assessment task objects
    }
  }

  componentDidMount() {
    //FETCH: Get all assessment task for this admin
    //Issue: Fetches all assessment task when specific filtering might be needed
    //Issue: This data may already be fetched by parent components
    genericResourceGET(
        `/assessment_task?admin_id=${this.props.chosenCourse["admin_id"]}`,
        "assessment_tasks", this, {dest: "assessmentTasks"} //API response key, component for setState
    );
  }

  render() {
    //Destrucute state for cleaner code
    const {
        error,
        errorMessage,
        isLoaded,
        assessmentTasks
    } = this.state;
    //Render case 1: Show error message if fetch failed with error object
    if(error) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={error.message}
                />
            </div>
        )
        //Render Case 2: Show error message if fetch failed with string message
    } else if(errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={errorMessage}
                />
            </div>
        )
        //Render case 4: Data successfully loaded - but renders nothing!
        //This is the core issue with this component
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