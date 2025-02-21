import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourcePOST, getHumanReadableDueDate } from "../../../../utility";
//import { UnitType, generateUnitList } from "../../../Admin/View/CompleteAssessmentTask/unit";


class ViewCompletedAssessmentTasks extends Component {
    render() {
        var completedAssessments = this.props.completedAssessments;
        var assessmentTasks = this.props.assessmentTasks;

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
                        // Note that when we are in adhoc mode CATs have no differing data from individual to teams.
                        const chosenAT = assessmentTasks.find(at => at.assessment_task_id === atId);
                        if (!chosenAT) {
                            return <>UNDEFINED</>
                        }
                        return <>{chosenAT.unit_of_assessment ? "Team" : "Individual"}</>;
                    }
                }
            },
            {
                name: "completed_by_role_id",
                label: "Completed By",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"140px" } },
                    setCellProps: () => { return { width:"140px" } },
                    customBodyRender: (roleId) => {
                        return <>{roleId === 5 ? "Student" : "TA/Instructor"}</>;
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
                              var singluarCompletedAssessment = null;
                              if (completedAssessments) {
                                  singluarCompletedAssessment
                                      = completedAssessments.find(
                                          completedAssessment => completedAssessment.assessment_task_id === atId
                                      ) ?? null;
                              }
                              genericResourcePOST(
                                `/rating`,
                                this,
                                JSON.stringify({
                                    "user_id" : singluarCompletedAssessment.user_id,
                                    "completed_assessment_id": singluarCompletedAssessment.completed_assessment_id,
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
