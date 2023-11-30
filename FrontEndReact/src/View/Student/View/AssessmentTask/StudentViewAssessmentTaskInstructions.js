import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { API_URL } from "../../../../App";
// import ViewAssessmentTaskInstructions from "./ViewAssessmentTaskInstructions";

// WARNING: Doesn't work
class StudentViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      rubrics: null
    }
  }
  componentDidMount() {
    console.log(this.props.chosen_assessment_task);
    console.log(this.props.chosen_complete_assessment_task)
    fetch(API_URL + `/rubric/${this.props.chosen_assessment_task===null && this.props.chosen_complete_assessment_task===null ? 1 : this.props.chosen_assessment_task["rubric_id"]}`)
    .then(res => res.json())
    .then(
        (result) => {
          this.setState({
            isLoaded: true,
            rubrics: result["content"]["rubrics"][0],
          })
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error: error
          })
        }
    )
  }
  render() {
    const {
      error,
      isLoaded,
      rubrics
    } = this.state;
    if (error) {
      return(
        <>
          <h1>Fetching data resulted in an error: { error.message }</h1>
        </>
      ) 
    } else if (!isLoaded) {
      return (
        <>
          <h1>Loading...</h1>
        </>
      )
    } else {
      if (rubrics) {
        console.log(rubrics); 
        return(
          <>
            <div className="container">
              <ViewAssessmentTaskInstructions
                chosen_complete_assessment_task={this.props.chosen_complete_assessment_task}
                readOnly={this.props.readOnly}
                data={rubrics["categories"]}
                category_json={(rubrics["category_json"])}
                setNewTab={this.props.setNewTab}
              />
            </div>
          </>
        )
      }
    }
  }
}

export default StudentViewAssessmentTaskInstructions;
