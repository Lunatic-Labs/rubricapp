import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';

class ViewAssessmentTaskInstructions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: this.props.rubric["categories"]
    }
  }
  handleContinueClick = () => {
    console.log("Continue");
  }

  render() {
    var categoryList = "";
    for(var category = 0; category < this.state.categories.length; category++) {
      categoryList += this.state.categories[category]["category_name"];
      if(category !== this.state.categories.length-1) {
        categoryList += ", ";
      }
    }

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
        Assessment Task Instructions
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
          Rubric
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
