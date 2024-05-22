import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from "../../../Error/ErrorMessage.js";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions.js";
import { genericResourceGET } from "../../../../utility.js";
import Loading from "../../../Loading/Loading.js";



class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: false,
      rubrics: null
    }
  }

  componentDidMount() {
    var state = this.props.navbar.state;

    genericResourceGET(
      `/rubric?rubric_id=${state.chosenAssessmentTask["rubric_id"]}`,
      "rubrics", this
    )
  }

  render() {
    const {
      errorMessage,
      isLoaded,
      rubrics
    } = this.state;

    if (errorMessage) {
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
        <Loading />
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
