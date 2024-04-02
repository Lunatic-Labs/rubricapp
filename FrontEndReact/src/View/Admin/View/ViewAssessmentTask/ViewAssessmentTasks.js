import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { IconButton } from '@mui/material';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';



class ViewAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;

        var roleNames = adminViewAssessmentTask.roleNames;
        var rubricNames = adminViewAssessmentTask.rubricNames;
        var assessmentTasks = adminViewAssessmentTask.assessmentTasks;

        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var setAddAssessmentTaskTabWithAssessmentTask = navbar.setAddAssessmentTaskTabWithAssessmentTask;
        var setCompleteAssessmentTaskTabWithID = navbar.setCompleteAssessmentTaskTabWithID;

        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (assessmentTaskName) => {
                        return(
                            <>
                                {assessmentTaskName ? assessmentTaskName : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (dueDate) => {
                        var date = new Date(dueDate);

                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();

                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

                        var minutesString = minute < 10 ? ("0" + minute): minute;
                        var twelveHourClock = hour < 12 ? "am": "pm";

                        var timeString = `${hour % 12}:${minutesString}${twelveHourClock}`;

                        var dueDateString = `${monthNames[month]} ${day} at ${timeString}`;

                        return(
                            <>
                                {dueDate && dueDateString ? dueDateString : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "role_id",
                label: "Completed By",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (roleId) => {
                        return (
                            <>
                                {roleNames && roleId ? roleNames[roleId] : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "rubric_id",
                label: "Rubric Used",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"117px"}},
                    setCellProps: () => { return { width:"117px"} },
                    customBodyRender: (rubricId) => {
                        return (
                            <>
                                {rubricNames && rubricId ? rubricNames[rubricId] : "N/A"}
                            </>
                        )
                    }
                }
            },
            {
                name: "show_ratings",
                label: "Ratings?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"100px"}},
                    setCellProps: () => { return { width:"100px"} },
                    customBodyRender: (ratings) => {
                        return(
                            <>
                                {ratings ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "show_suggestions",
                label: "Improvements?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"20px"}},
                    setCellProps: () => { return { width:"20px"} },
                    customBodyRender: (suggestions) => {
                        return(
                            <>
                                {suggestions ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "unit_of_assessment",
                label: "Team Assessment?",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"155px"}},
                    setCellProps: () => { return { width:"155px"} },
                    customBodyRender: (unitOfAssessment) => {
                        return(
                            <>
                                {unitOfAssessment ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "EDIT",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"} },
                    customBodyRender: (assessmentTaskId) => {
                        if (assessmentTaskId && assessmentTasks && chosenCourse && rubricNames) {
                            return (
                                <IconButton id=""
                                onClick={() => {
                                    setAddAssessmentTaskTabWithAssessmentTask(
                                        assessmentTasks,
                                        assessmentTaskId,
                                        chosenCourse,
                                        roleNames,
                                        rubricNames
                                    )
                                }}>
                               <EditIcon sx={{color:"black"}}/>
                             </IconButton>
                            )

                        } else {
                            return(
                                <>
                                    {"N/A"}
                                </>
                            )
                        }
                    },    
                }
            },
            {
                name: "assessment_task_id",
                label: "VIEW",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"} },
                    customBodyRender: (assessmentTaskId) => {
                        if (assessmentTaskId && assessmentTasks) {
                            return(
                                <IconButton id=""
                                onClick={() => {
                                    setCompleteAssessmentTaskTabWithID(
                                        assessmentTasks,
                                        assessmentTaskId
                                    );
                                }} >
                               <VisibilityIcon sx={{color:"black"}} />
                             </IconButton>
                            )

                        } else {
                            return(
                                <>
                                    {"N/A"}
                                </>
                            )
                        }
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "TO DO",
                options: {
                    filter: false,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"} },
                    customBodyRender: (atId) => {
                        return (
                                <Button
                                    className='primary-color'
                                    variant='contained'
                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId);
                                    }}
                                >
                                    Complete
                                </Button>
                        )
                        
                    }
                }
            }
        ]

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "45vh"
        };

        return(
            <>
                <CustomDataTable
                    data={assessmentTasks ? assessmentTasks : []}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewAssessmentTasks;
