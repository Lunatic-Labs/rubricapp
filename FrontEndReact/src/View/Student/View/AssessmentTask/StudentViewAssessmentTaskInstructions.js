import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewAssessmentTaskInstructions from './ViewAssessmentTaskInstructions' 
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';

// NOTE: Took the mount code from the StudentViewAssessmentTask file
//       not entirely sure as if we need it yet.
class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      instructions: null
    }
  }
  componentDidMount() {
    fetch(API_URL + `/assessment_task?course_id=${this.props.chosenCourse["course_id"]}`)
    .then(res => res.json())
    .then((result) => {
        if(result["success"]===false) {
            this.setState({
                isLoaded: true,
                errorMessage: result["message"]
            })
        } else {
            this.setState({
                isLoaded: true,
                assessment_tasks: result['content']['assessment_tasks'][0]
            })
    }},
    (error) => {
        this.setState({
            isLoaded: true,
            error: error
        })
    })
    fetch(API_URL + `/rubric`)
    .then(res => res.json())
    .then((result) => {
        if(result["success"]===false) {
            this.setState({
                isLoaded: true,
                errorMessage: result["message"]
            })
        } else {
            var rubric = result['content']['rubrics'][0];
            var rubric_names = {};
            for(var r = 0; r < rubric.length; r++) {
                rubric_names[rubric[r]["rubric_id"]] = rubric[r]["rubric_name"];
            }
            this.setState({
                isLoaded: true,
                rubric_names: rubric_names
            })
    }},
    (error) => {
        this.setState({
            isLoaded: true,
            error: error
        })
    })
  }

  render() {
    const {
      error,
      errorMeassage,
      isLoaded,
      // instructions
    } = this.state;
    if (error) {
      return(
        <div className='container'>
          <ErrorMessage
            fetchedResource={"Assessment Task instructions Page"}
            errorMessage={error.message}
          />
        </div>
      )
    } else if(errorMeassage) {
      return(
        <div className='container'>
          <ErrorMessage
            fetchedResource={"Assessment Task instructions Page"}
            errorMessage={error.message}
          />
        </div>
      )
    } else if(!isLoaded) {
      return(
        <div className='container'>
          <h1>Loading...</h1>
        </div>
      )
    } else {
      return(
        <div className='container'>
          <ViewAssessmentTaskInstructions
            setNewTab={this.props.setNewTab}
          />
        </div>
      )
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
