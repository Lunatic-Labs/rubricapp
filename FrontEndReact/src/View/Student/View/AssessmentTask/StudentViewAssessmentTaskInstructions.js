import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { API_URL } from "../../../../App";
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";

class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      rubric: null
    }
  }
  componentDidMount() {
    fetch(API_URL + `/rubric/${this.props.chosen_assessment_task["rubric_id"]}`)
    .then(res => res.json())
    .then((result) =>{
        if(result["success"]===false){
          this.setState({
            isLoaded: true,
            errorMessage: result["message"]
          })
        } else {
          this.setState({
            isLoaded: true,
            rubric: result["content"]["rubrics"][0]
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
      errorMessage,
      isLoaded,
      rubric
    } = this.state;
    if(error) {
      return(
        <div className="container">
          <ErrorMessage 
            fetchedResource={"Instructions"}
            errorMessage={errorMessage}
          />
        </div>
      )
    } else if (!isLoaded) {
      return(
        <div className="container">
          <h1>Loading...</h1>
        </div>
      ) 
    } else {
      return(
        <ViewAssessmentTaskInstructions
          rubric={rubric}
          chosen_assessment_task={this.props.chosen_assessment_task}
        />
      ) 
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
