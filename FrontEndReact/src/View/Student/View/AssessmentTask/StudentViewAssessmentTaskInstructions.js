import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";
import { genericResourceGET } from "../../../../utility";

class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      rubrics: null
    }
  }

  componentDidMount() {
    var state = this.props.navbar.state;
    genericResourceGET(
      `/rubric?rubric_id=${state.chosen_assessment_task["rubric_id"]}`,
      "rubrics", this
    )
  }

  render() {
    const {
      error,
      errorMessage,
      isLoaded,
      rubrics
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
    } else if (!isLoaded || !rubrics) {
      return(
        <div className="container">
          <h1>Loading...</h1>
        </div>
      ) 
    } else {
      return(
        <ViewAssessmentTaskInstructions
          rubrics={rubrics}
          navbar={this.props.navbar}
        />
      ) 
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
