import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from "../../../Error/ErrorMessage";
import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";
import { genericResourceGET } from "../../../../utility";
import Loading from "../../../Loading/Loading";

/**
 * @description
 * Wrapper for the student view of assessment task instructions.
 * 
 * Responsibilities:
 *  - Reads the currently chosen assessment task from navbar.state.
 *  - Fetches the rubric for that assessment task.
 *  - Handles loading / error states.
 *  - Once loaded, passes rubric data into <ViewAssessmentTaskInstructions />.
 *
 * @prop {object} navbar           - Navbar instance; expects state.chosenAssessmentTask
 *                                   with a rubric_id field.
 *
 * @property {string|null} state.errorMessage - Error from loading rubric data, if any.
 * @property {boolean}     state.isLoaded     - True when the rubric fetch has completed.
 * @property {object|null} state.rubrics      - Rubric data for the selected assessment task.
 */
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

  /**
   * @method componentDidMount
   * @description
   * On mount, fetches the rubric associated with the currently chosen
   * assessment task (from navbar.state.chosenAssessmentTask).
   *
   * Fetch:
   *  - GET /rubric?rubric_id={rubric_id}
   *    - Query params:
   *        * rubric_id — rubric_id taken from navbar.state.chosenAssessmentTask.rubric_id
   *    - Result is stored in state.rubrics via genericResourceGET (dest: "rubrics").
   *
   * Notes:
   *  - This call retrieves exactly one rubric (no over-fetching).
   *  - Rubrics are also fetched in other views (e.g., dashboard-level “all” rubrics),
   *    so this may be a candidate JIRA item for consolidating rubric loading.
   *  - No sorting is performed here; data is simply passed down to the child component.
   */
  componentDidMount() {
    var state = this.props.navbar.state;

    genericResourceGET(
      `/rubric?rubric_id=${state.chosenAssessmentTask["rubric_id"]}`,
      "rubrics", this as any, {dest: "rubrics"}
    )
  }

  /**
   * @method render
   * @description
   * Renders:
   *  - <ErrorMessage /> if rubric fetch failed.
   *  - <Loading /> while rubric data is still being fetched.
   *  - <ViewAssessmentTaskInstructions /> once rubrics are loaded.
   */
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
