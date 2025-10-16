import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import {genericResourcePOST} from '../../../../utility.js';
import Cookies from 'universal-cookie';

class ViewAssessmentTaskInstructions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: this.props.rubrics["category_json"],
            instructions: this.props.navbar.state.chosenAssessmentTask["comment"],
            skipInstructions: this.props.navbar.state.skipInstructions,
        }
    }

    handleContinueClick = async () => {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const cookies = new Cookies();

        try {
            const userId = cookies.get('user')?.user_id;
            if (!userId) {
                console.error('User ID not found in cookies');
                this.props.navbar.setNewTab("ViewStudentCompleteAssessmentTask");
                return;
            }

            const assessmentTaskId = state.chosenAssessmentTask?.assessment_task_id;
            if (!assessmentTaskId) {
                console.error('Assessment task ID not found');
                this.props.navbar.setNewTab("ViewStudentCompleteAssessmentTask");
                return;
            }

            const completedAssessmentId = state.chosenCompleteAssessmentTask?.completed_assessment_id;
            
            if (completedAssessmentId) {
                await genericResourcePOST(
                    '/feedback',
                    this,
                    JSON.stringify({
                        user_id: userId,
                        completed_assessment_id: completedAssessmentId
                    })
                );
            }

        } catch (error) {
            console.error('Error recording feedback view:', error);
        }

        this.props.navbar.setNewTab("ViewStudentCompleteAssessmentTask");
    }

    render() {
        const skipInstructions = this.state.skipInstructions;

        var assessmentTaskName = this.props.navbar.state.chosenAssessmentTask.assessmentTaskName;

        var rubricName = this.props.rubrics["rubric_name"];

        var rubricDescription = this.props.rubrics["rubric_description"];

        var categoryList = Object.keys(this.state.categories).map((category, index) => {

            if(index !== Object.keys(this.state.categories).length-1) {
                category += ", ";
            }

            return category;
        });

        if (skipInstructions) {
            this.handleContinueClick();
            return <></>;
        }

        return (
            <>
                <h2
                    style={{
                        textAlign: "start",
                        paddingLeft: "3rem",
                        paddingTop: "1rem",
                        fontWeight: '700'
                    }}
                    aria-label="viewAssessmentTaskInstructionsTitle"
                >
                    {assessmentTaskName}
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
                        <h3 style={{ textAlign: 'left', fontWeight: '700' }}>
                            {"Rubric for " + rubricName}
                        </h3>

                        <h6 style={{ textAlign: 'left', fontWeight: '600' }}>
                            Rubric Description: {rubricDescription}
                        </h6>

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
                                            margin: "1rem",
                                            fontWeight: "bold",
                                            width: "80%",
                                            textAlign: "center"
                                        }}
                                    >
                                        Assessment Categories: {categoryList}
                                    </h4>
                                </div>
                                <h2
                                    style={{
                                        textAlign: 'left',
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
                                    aria-label="viewAssessmentTaskInstructionsContinueButton"
                                >
                                    Complete rubric
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