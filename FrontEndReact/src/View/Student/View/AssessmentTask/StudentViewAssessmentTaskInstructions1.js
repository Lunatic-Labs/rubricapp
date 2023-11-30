import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { API_URL } from "../../../../App";

// WARNING: Doesn't work yet 
class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      assessment_tasks: null,
      instructions: null,
      categories: null
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
  }
}
