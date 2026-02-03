import React, { Component } from "react";
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";
import { genericResourceGET } from "../../../../utility";
import Loading from "../../../Loading/Loading";

interface StudentViewAssessmentTaskInstructionsProps {
  navbar: any;
}

interface StudentViewAssessmentTaskInstructionsState {
  errorMessage: string | null;
  isLoaded: boolean;
  rubrics: any | null;
}

class StudentViewAssessmentTaskInstructions extends Component<StudentViewAssessmentTaskInstructionsProps, StudentViewAssessmentTaskInstructionsState> {
  constructor(props: StudentViewAssessmentTaskInstructionsProps) {
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
      "rubrics", this as any, {dest: "rubrics"}
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
          navbar={this.props.navbar}
          rubrics={rubrics}
        />
      )
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
