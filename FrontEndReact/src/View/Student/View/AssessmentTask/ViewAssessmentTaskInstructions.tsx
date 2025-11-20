// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Button' or its c... Remove this comment to see the full error message
import Button from '@mui/material/Button';
import {genericResourcePOST} from '../../../../utility.js';
// @ts-expect-error TS(2307): Cannot find module 'universal-cookie' or its corre... Remove this comment to see the full error message
import Cookies from 'universal-cookie';
import ErrorMessage from "../../../Error/ErrorMessage.js";

class ViewAssessmentTaskInstructions extends Component {
    props: any;
    setState: any;
    state: any;
    constructor(props: any) {
        super(props);
        this.state = {
            categories: this.props.rubrics["category_json"],
            instructions: this.props.navbar.state.chosenAssessmentTask["comment"],
            skipInstructions: this.props.navbar.state.skipInstructions,
            errorMessage: null
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
            const completedAssessmentId = state.chosenCompleteAssessmentTask?.completed_assessment_id;
            
            // Check if coming from completed assessments page
            if (state.chosenCompleteAssessmentTask) {
                if (completedAssessmentId) {
                    console.error('Completed Assessment Task ID not found');
                    this.props.navbar.setNewTab("ViewStudentCompleteAssessmentTask");
                    return;
                }
                
                await genericResourcePOST(
                    '/feedback',
                    this,
                    JSON.stringify({
                        user_id: userId,
                        completed_assessment_id: completedAssessmentId
                    })
                );
            } else {
                // Coming from assessments page
                if (!assessmentTaskId) {
                    this.setState({
                        errorMessage: "Assessment Task ID not found"
                    });
                    return;
                }
            }

        } catch (error) {
            console.error('Error in recording feedback view:', error);
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
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
            return <></>;
        }

        return (
            <>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </h2>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <h3 style={{ textAlign: 'left', fontWeight: '700' }}>
                            {"Rubric for " + rubricName}
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        </h3>

                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <h6 style={{ textAlign: 'left', fontWeight: '600' }}>
                            Rubric Description: {rubricDescription}
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        </h6>

                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start'
                            }}>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <div
                                style={{
                                    padding: "20px",
                                    border: "solid 1px #0000003b"
                                }}
                            >
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                <div
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center"
                                    }}
                                >
                                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                    <h4
                                        style={{
                                            margin: "1rem",
                                            fontWeight: "bold",
                                            width: "80%",
                                            textAlign: "center"
                                        }}
                                    >
                                        Assessment Categories: {categoryList}
                                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                    </h4>
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                </div>
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                <h2
                                    style={{
                                        textAlign: 'left',
                                        marginLeft: "8px"
                                    }}>
                                    Instructions
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                </h2>
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                <textarea
                                    style={{
                                        width: "98%",
                                        minHeight: "15rem"
                                    }}
                                    defaultValue={this.state.instructions}
                                    readOnly
                                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                                ></textarea>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            </div>
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
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
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            </div>
                        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                        </div>
                    // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                    </div>
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            </>
        )
    }
}

export default ViewAssessmentTaskInstructions;