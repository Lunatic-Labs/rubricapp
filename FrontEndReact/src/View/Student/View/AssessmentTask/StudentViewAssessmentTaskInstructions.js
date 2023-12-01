import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { API_URL } from "../../../../App";
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";

// WARNING: Doesn't work yet 
class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      instructions: null,
      categories: null
    }
  }
  componentDidMount() {
    fetch(API_URL + `/assessment_task/${this.props.chosen_assessment_task}`)
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
            // TODO: Need to find the branch that has instructions and replace show_suggestions with instructions
            instructions: result["show_suggestions"] 
          })
    }},
    (error) => {
        this.setState({
            isLoaded: true,
            error: error
        })
    })
    fetch(API_URL + `/rubric/${this.props.chosen_assessment_task}`)
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
            categories: result["categories"]
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
      instructions,
      categories
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
        <div className="container">
          <ViewAssessmentTaskInstructions
            categories={categories}
            // instructions={instructions} 
            setNewTab={this.props.setNewTab} 
          />
        </div>
      ) 
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
