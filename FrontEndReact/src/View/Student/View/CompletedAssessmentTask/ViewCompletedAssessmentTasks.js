import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourcePOST, getHumanReadableDueDate } from "../../../../utility";

/**
 * @description
 * Defines the columns and behavior for the "Completed Assessments" table.
 *
 * Responsibilities:
 *  - Displays completed assessments with timing and unit-of-assessment info.
 *  - On "View" click, records that the rubric has been viewed (via POST /rating),
 *    then navigates to the instructions/feedback view in read-only mode.
 *
 * Props:
 *  @prop {object} navbar              - Navbar instance; used for navigation.
 *  @prop {Array}  assessmentTasks     - All ATs needed to derive column data
 *                                       (unit_of_assessment, role_id, etc.).
 *  @prop {Array}  completedAssessments - Completed CATs to display as rows.
 */
class ViewCompletedAssessmentTasks extends Component {
    /**
     * @method render
     * @description
     * Builds the column definitions for CustomDataTable, including:
     *  - Task name
     *  - Initial time
     *  - Last update
     *  - Unit of assessment (Team/Individual)
     *  - Completed by (Student vs TA/Instructor)
     *  - View button (records rating view via POST and navigates)
     *
     * Sorting:
     *  - Column-level sorting is handled by CustomDataTable.
     *  - This component does not pre-sort completedAssessments; they are passed
     *    to the table in the order received from the parent.
     */
    render() {
        const completedAssessments = this.props.completedAssessments;
        const assessmentTasks = this.props.assessmentTasks;

        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"250px" } },
                    setCellProps: () => { return { width:"250px" } },
                }
            },
            {
                name: "initial_time",
                label: "Initial Time",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"150px" } },
                    setCellProps: () => { return { width:"150px" } },
                    customBodyRender: (initial_time) => {
                        return(
                            <>
                                {initial_time ? getHumanReadableDueDate(initial_time) : "N/A"}
                            </>
                        );
                    }
                }
            },
            {
                name: "last_update",
                label: "Last Update",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"150px" } },
                    setCellProps: () => { return { width:"150px" } },
                    customBodyRender: (last_update) => {
                        return(
                            <>
                                {last_update ? getHumanReadableDueDate(last_update) : "N/A"}
                            </>
                        );
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Unit of Assessment",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"170px" } },
                    setCellProps: () => { return { width:"140px" } },
                    customBodyRender: (atId) => {
                        const chosenAT = assessmentTasks.find(at => at.assessment_task_id === atId);
                        if (!chosenAT) {
                            return <>UNDEFINED</>
                        }
                        return <>{chosenAT.unit_of_assessment ? "Team" : "Individual"}</>;
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "Completed By",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"140px" } },
                    setCellProps: () => { return { width:"140px" } },
                    customBodyRender: (atId) => {
                        const at = assessmentTasks.find(at => at.assessment_task_id === atId);
                        const completer = at?.role_id;
                        return <>{completer === 5 ? "Student" : "TA/Instructor"}</>;
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "View",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"100px", className:"button-column-alignment" } },
                    setCellProps: () => { return { align:"center", width:"100px", className:"button-column-alignment" } },
                    customBodyRender: (atId) => {
                        return (
                            <div>
                                <IconButton
                                    onClick={() => {
                                        let singularCompletedAssessment = null;

                                        if (completedAssessments) {
                                            singularCompletedAssessment =
                                                completedAssessments.find(
                                                    completedAssessment =>
                                                        completedAssessment.assessment_task_id === atId
                                                ) ?? null;
                                        }

                                        /**
                                         * POST /rating
                                         *
                                         * Purpose:
                                         *  - Record that a user has viewed the rating/feedback for a
                                         *    specific completed assessment.
                                         *
                                         * Endpoint:
                                         *  - POST /rating
                                         *
                                         * Body (JSON):
                                         *  {
                                         *    "user_id": <number>,                 // singularCompletedAssessment.user_id
                                         *    "completed_assessment_id": <number>  // singularCompletedAssessment.completed_assessment_id
                                         *  }
                                         *
                                         * Notes:
                                         *  - No query parameters are used on this endpoint.
                                         *  - This call runs each time the "View" icon is clicked before
                                         *    navigating to the instructions/feedback view.
                                         */
                                        if (singularCompletedAssessment) {
                                            genericResourcePOST(
                                                `/rating`,
                                                this,
                                                JSON.stringify({
                                                    "user_id" : singularCompletedAssessment.user_id,
                                                    "completed_assessment_id": singularCompletedAssessment.completed_assessment_id,
                                                }),
                                            );
                                        }

                                        this.props.navbar.setAssessmentTaskInstructions(
                                            assessmentTasks,
                                            atId,
                                            completedAssessments,
                                            { readOnly: true, skipInstructions: true }
                                        );
                                    }}
                                    aria-label="completedAssessmentTasksViewIconButton"
                                >
                                    <VisibilityIcon sx={{color:"black"}} />
                                </IconButton>
                            </div>
                        )
                    }
                }
            },
        ];

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem"
        };

        return (
            <CustomDataTable
                data={completedAssessments ? completedAssessments : []}
                columns={columns}
                options={options}
            />
        )
    }
}

export default ViewCompletedAssessmentTasks;
