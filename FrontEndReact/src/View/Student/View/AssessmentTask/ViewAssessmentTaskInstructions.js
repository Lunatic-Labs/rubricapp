import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import CustomButton from "../Components/CustomButton";

class ViewAssessmentTaskInstructions extends Component {

  handleContinueClick = () => {
    console.log("Continue");
  }

  render() {
    console.log(this.props.categories);

    return (
     <>
      <div 
          style={{ 
            display: 'flex',
            width: '100%',
            height: '100vh',
            padding: '50px', 
            background: '#F8F8F8',

          }}>
          <div>
            <h2 style={{ paddingTop: '16px', marginLeft: '-130px', bold: true, textAlign: 'left'}}> Assessment Task Instructions </h2>
            <div className="cotainer"
              style={{
								backgroundColor: '#FFF',
								border: '3px, 0px, 0px, 0px',
								borderTop: '3px solid #4A89E8', 
								borderRadius: '10px', 
								flexDirection: 'column',
								justifyContent: 'flex-start',
                position: 'absolute',
                left: '50px',
                display: 'flex',
								width: '90%',
								height: '80%',
								marginTop: '30px', 
								padding:'24px', 
								paddingBottom: '80px',
								gap: 20,
              }}>
              <h2 style={{ textAlign: 'left', }}> Rubric </h2>
              <div className="container"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  position: 'absolute',
                }}>
              </div>
            </div>
          </div>
      </div>
     </>
    )
  }
}

export default ViewAssessmentTaskInstructions;
