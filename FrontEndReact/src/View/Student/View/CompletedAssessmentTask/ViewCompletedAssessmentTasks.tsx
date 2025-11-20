// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { IconButton } from "@mui/material";
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Visibility... Remove this comment to see the full error message
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourcePOST, getHumanReadableDueDate } from "../../../../utility";


/**
 * @description Column logic.
 * 
 * @prop {object} navbar - Passed navbar.
 * @prop {object} assessmentTasks - ATs. Note we need the original ATs to load the rest of the columns.
 * @prop {object} completedAssessments - Filtered CATs.
 * 
 */

class ViewCompletedAssessmentTasks extends Component {
    props: any;
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
                    customBodyRender: (initial_time: any) => {
                        return(
                            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
                            <>
                                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
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
                    customBodyRender: (last_update: any) => {
                        return(
                            <>
                                // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
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
                    customBodyRender: (atId: any) => {
                        const chosenAT = assessmentTasks.find((at: any) => at.assessment_task_id === atId);
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
                    customBodyRender: (atId: any) => {
                        const at = assessmentTasks.find((at: any) => at.assessment_task_id === atId);
                        const completer = at.role_id;
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
                    customBodyRender: (atId: any) => {
                        return (
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            <div>
                                <IconButton
                                    onClick={() => {
                              var singularCompletedAssessment = null;
                              if (completedAssessments) {
                                  singularCompletedAssessment
                                      = completedAssessments.find(
                                          (completedAssessment: any) => completedAssessment.assessment_task_id === atId
                                      ) ?? null;
                              }
                              genericResourcePOST(
                                `/rating`,
                                this,
                                JSON.stringify({
                                    "user_id" : singularCompletedAssessment.user_id,
                                    "completed_assessment_id": singularCompletedAssessment.completed_assessment_id,
                                }),
                              );
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
                            // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                            </div>
                        );
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
