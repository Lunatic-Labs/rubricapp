import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";
import { IconButton } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { genericResourcePOST, getHumanReadableDueDate } from "../../../../utility";
//import { UnitType, generateUnitList } from "../../../Admin/View/CompleteAssessmentTask/unit";


class ViewCompletedAssessmentTasks extends Component {
    render() {
        // var navbar = this.props.navbar;

        var completedAssessments = this.props.completedAssessments;
        var assessmentTasks = this.props.assessmentTasks;

        // This is too consuming. Fix is reworking this so 
        // that when the network request comes back all this work is already done.
        // as it stands this work is done repeadtly and there seems to be unneeded requests.
        //const unitList = generateUnitList({
        //    roleName
        //})
        

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
                        const assessmentTask = completedAssessments.find(at => at.assessment_task_id === atId);
                        if (assessmentTask === undefined) {
                            return <>UNDEFINED</>
                        }
                        return <>{assessmentTask.team_id ? "Team" : "Individual"}</>;
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
