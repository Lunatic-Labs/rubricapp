import React, { Component } from "react";
// @ts-ignore: allow importing CSS without type declarations
import "bootstrap/dist/css/bootstrap.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";
import { genericResourceGET } from "../../../../utility";
import Loading from "../../../Loading/Loading";

interface StudentViewAssessmentTaskInstructionsProps {
  navbar: any;
}

interface StudentViewAssessmentTaskInstructionsState {
  error: any;
  errorMessage: string | null;
  isLoaded: boolean;
  rubrics: any | null;
}

class StudentViewAssessmentTaskInstructions extends Component<
  StudentViewAssessmentTaskInstructionsProps,
  StudentViewAssessmentTaskInstructionsState
> {
  constructor(props: StudentViewAssessmentTaskInstructionsProps) {
    super(props);

    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      rubrics: null,
    };
  }

  componentDidMount() {
    const state = this.props.navbar?.state;
    const rubricId = state?.chosenAssessmentTask?.["rubric_id"];

    if (!rubricId) {
      this.setState({
        errorMessage: "Rubric ID not found for the selected assessment task.",
        isLoaded: true,
      });
      return;
    }

    genericResourceGET(
      `/rubric?rubric_id=${rubricId}`,
      "rubrics",
      this as any,
      { dest: "rubrics" }
    );
  }

  render(): JSX.Element {
    const { errorMessage, isLoaded, rubrics } = this.state;

    if (errorMessage) {
      return (
        <div className="container">
          <ErrorMessage errorMessage={errorMessage} />
        </div>
      );
    }

    if (!isLoaded || !rubrics) {
      return <Loading />;
    }

    return (
      <ViewAssessmentTaskInstructions
        navbar={this.props.navbar}
        rubrics={rubrics}
      />
    );
  }
}

export default StudentViewAssessmentTaskInstructions;
