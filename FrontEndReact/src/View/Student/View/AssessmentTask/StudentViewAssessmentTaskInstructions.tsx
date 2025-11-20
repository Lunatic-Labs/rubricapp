// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from "../../../Error/ErrorMessage.js";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions.js";
import { genericResourceGET } from "../../../../utility.js";
import Loading from "../../../Loading/Loading.js";



class StudentViewAssessmentTaskInstructions extends Component {
  props: any;
  state: any;
  constructor(props: any) {
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
      "rubrics", this, {dest: "rubrics"}
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
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className="container">
          <ErrorMessage
            fetchedResource={"Instructions"}
            errorMessage={errorMessage}
          />
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
