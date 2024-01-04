import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';

class ViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.rubrics["category_json"],
      instructions: this.props.navbar.state.chosen_assessment_task["comment"],
    }
  }

  handleContinueClick = () => {
    this.props.navbar.setNewTab("ViewStudentCompleteAssessmentTask");
  }

  render() {
    var assessment_task_name = this.props.navbar.state.chosen_assessment_task.assessment_task_name;
    var categoryList = Object.keys(this.state.categories).map((category, index) => {
      if(index !== Object.keys(this.state.categories).length-1) {
        category += ", ";
      }
      return category;
    });

    return (
     <>
      <h2
        style={{
          textAlign: "start",
          paddingLeft: "3rem",
          paddingTop: "5rem",
          fontWeight: '700'
        }}
      >
        {assessment_task_name}
      </h2>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
      <div
        style={{
          borderTop: '3px solid #4A89E8', 
          border: '3px, 0px, 0px, 0px',
          borderRadius: '10px', 
          marginTop: '30px', 
          paddingLeft:'5rem',
          paddingRight:'5rem',
          paddingTop:'2rem',
          backgroundColor: "white",
          width: '90%',
          height: 'fit-content'
        }}
      >
        <h3 style={{
          textAlign: 'left',
          fontWeight: '700'
        }}>
          {"Rubric for: " + assessment_task_name}
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}>
            <div
              style={{
                padding: "20px",
                border: "solid 1px #0000003b"
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <h4
                  style={{
                    margin: "3rem",
                    fontWeight: "bold",
                    width: "80%",
                    textAlign: "center"
                  }}
                >
                  {categoryList}
                </h4>
              </div>
              <h2
                style={{
                  textAlign: 'left',
                  marginTop: "20px",
                  marginLeft: "8px"
                }}>
                  Instructions
              </h2>
              <textarea
                style={{
                  width: "98%",
                  minHeight: "15rem"
                }}
                defaultValue={this.state.instructions}
                readOnly
              ></textarea>
            </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "end"
                }}
              >
                <Button
                  style={{
                    color: "white",
                    backgroundColor: "#2E8BEF",
                    borderRadius: "4px",
                    marginTop: "1rem",
                    marginBottom: "0.5rem"
                  }}
                  onClick={() => {
                    this.handleContinueClick();
                  }}
                >
                  CONTINUE
                </Button>
              </div>
        </div>
      </div>
      </div>
     </>
    )
  }
}

export default ViewAssessmentTaskInstructions;
