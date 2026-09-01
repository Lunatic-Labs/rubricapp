import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourcePOST, formatTime } from "../../../../utility";
import { AssessmentTask } from '../../../../types/AssessmentTask';
import { CompleteAssessmentTask } from '../../../../types/CompleteAssessmentTask';
import { GridColDef } from '@mui/x-data-grid';

interface ViewCompletedAssessmentTasksProps {
    navbar: any;
    assessmentTasks: AssessmentTask[];
    completedAssessments: CompleteAssessmentTask[];
}

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

class ViewCompletedAssessmentTasks extends Component<ViewCompletedAssessmentTasksProps> {
    render() {
        const completedAssessments = this.props.completedAssessments;
        const assessmentTasks = this.props.assessmentTasks;

        const columns: GridColDef[] = [
            {
                field: "assessment_task_name",
                headerName: "Task Name",
                width: 250,
            },
            {
                field: "initial_time",
                headerName: "Initial Time",
                width: 150,
                renderCell: (params) => {
                    const atId = params.row.assessment_task_id;
                    const chosenAT = assessmentTasks.find((at: AssessmentTask) => at.assessment_task_id === atId);
                    const timeZone = chosenAT?.time_zone || '';
                    return(
                        <>
                            {params.value ? formatTime(params.value, timeZone) : "N/A"}
                        </>
                    );
                }
            },
            {
                field: "last_update",
                headerName: "Last Update",
                width: 150,
                renderCell: (params) => {
                    const atId = params.row.assessment_task_id;
                    const chosenAT = assessmentTasks.find((at: AssessmentTask) => at.assessment_task_id === atId);
                    const timeZone = chosenAT?.time_zone || '';
                    return(
                        <>
                            {params.value ? formatTime(params.value, timeZone) : "N/A"}
                        </>
                    );
                }
            },
            {
                field: "assessment_task_id",
                headerName: "Unit of Assessment",
                width: 170,
                renderCell: (params) => {
                    const chosenAT = assessmentTasks.find((at) => at.assessment_task_id === params.value);
                    if (!chosenAT) {
                        return <>UNDEFINED</>
                    }
                    return <>{chosenAT.unit_of_assessment ? "Team" : "Individual"}</>;
                }
            },
            {
                field: "completed_by_role",
                headerName: "Completed By",
                width: 140,
                renderCell: (params) => {
                    const atId = params.row.assessment_task_id;
                    const at = assessmentTasks.find((at) => at.assessment_task_id === atId);
                    const completer = at?.role_id;
                    return <>{completer === 5 ? "Student" : "TA/Instructor"}</>;
                }
            },
            {
                field: "view_action",
                headerName: "View",
                width: 100,
                sortable: false,
                filterable: false,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => {
                    const atId = params.row.assessment_task_id;
                    return (
                        <div>
                            <IconButton
                                onClick={() => {
                          var singularCompletedAssessment = null;
                          if (completedAssessments) {
                              singularCompletedAssessment
                                  = completedAssessments.find(
                                      (completedAssessment) => completedAssessment.assessment_task_id === atId
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
                          genericResourcePOST(
                            `/rating`,
                            this,
                            JSON.stringify({
                                "user_id" : singularCompletedAssessment!.user_id,
                                "completed_assessment_id": singularCompletedAssessment!.completed_assessment_id,
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
                        </div>
                    );
                }
            },
        ];

        return (
            <CustomDataTable
                data={completedAssessments ? completedAssessments : []}
                columns={columns}
                getRowId={(row) => row.completed_assessment_id}
                height="21rem"
            />
        )
    }
}

export default ViewCompletedAssessmentTasks;
