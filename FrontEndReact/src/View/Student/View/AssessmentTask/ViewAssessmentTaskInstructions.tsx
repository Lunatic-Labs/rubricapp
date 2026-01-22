import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import {genericResourcePOST} from '../../../../utility';
import Cookies from 'universal-cookie';
import ErrorMessage from "../../../Error/ErrorMessage";

interface ViewAssessmentTaskInstructionsProps {
    navbar: any;
    rubrics: any;
}

/**
 * @description
 * Displays the assessment task instructions and rubric summary for a student
 * before they complete the rubric. When the user continues, this component
 * optionally records a feedback view (via POST /feedback) and then navigates
 * to "ViewStudentCompleteAssessmentTask".
 *
 * @prop {object} navbar         - Navbar instance; uses state.chosenAssessmentTask,
 *                                 state.chosenCompleteAssessmentTask, and skipInstructions.
 * @prop {object} rubrics        - Rubric metadata for the chosen assessment task.
 *                                 Expects keys: "category_json", "rubric_name",
 *                                 "rubric_description".
 *
 * @property {object} state.categories     - Category JSON for the rubric (from rubrics.category_json).
 * @property {string} state.instructions   - Assessment instructions (from navbar.state.chosenAssessmentTask.comment).
 * @property {boolean} state.skipInstructions - If true, skips rendering instructions
 *                                             and immediately proceeds to handleContinueClick.
 * @property {string|null} state.errorMessage - Error message to display if we cannot
 *                                              proceed (e.g., missing assessmentTaskId).
 */

interface ViewAssessmentTaskInstructionsState {
    categories: any;
    instructions: string;
    skipInstructions: boolean;
    errorMessage: string | null;
}

class ViewAssessmentTaskInstructions extends Component<ViewAssessmentTaskInstructionsProps, ViewAssessmentTaskInstructionsState> {
    constructor(props: ViewAssessmentTaskInstructionsProps) {
        super(props);
        this.state = {
            categories: this.props.rubrics["category_json"],
            instructions: this.props.navbar.state.chosenAssessmentTask["comment"],
            skipInstructions: this.props.navbar.state.skipInstructions,
            errorMessage: null
        }
    }

    /**
     * @method handleContinueClick
     * @description
     * Handles the "Complete rubric" / continue action.
     *
     * Behavior:
     *  - Reads user_id from cookies and assessment context from navbar.state.
     *  - If the user navigated here from a completed assessment (state.chosenCompleteAssessmentTask):
     *      * Sends a POST to /feedback to record that this user viewed feedback.
     *  - If the user navigated here from the "My Assessment Tasks" section:
     *      * Verifies that an assessment_task_id exists; if not, sets an error and stays.
     *  - On success (or on recoverable error), navigates to "ViewStudentCompleteAssessmentTask".
     *
     * POST:
     *  - Endpoint: POST /feedback
     *  - Query params: none
     *  - Body (JSON):
     *      {
     *        "user_id": <number>,                // from cookies.get('user').user_id
     *        "completed_assessment_id": <number> // from navbar.state.chosenCompleteAssessmentTask.completed_assessment_id
     *      }
     *
     * Notes:
     *  - This method does not perform any sorting; it only writes feedback and changes tabs.
     *  - Any issues with missing IDs or cookies result in logging an error and redirecting
     *    to "ViewStudentCompleteAssessmentTask" or setting an errorMessage.
     */
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
                    this as any,
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

        // If instructions should be skipped, immediately run the continue handler.
        if (skipInstructions) {
            this.handleContinueClick();
            return <></>;
        }

        return (
            <>
                {this.state.errorMessage && (
                    <ErrorMessage errorMessage={this.state.errorMessage} />
                )}
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
