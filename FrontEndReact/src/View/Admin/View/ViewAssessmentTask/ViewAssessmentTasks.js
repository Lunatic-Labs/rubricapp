import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';



class ViewAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;

        var role_names = adminViewAssessmentTask.role_names;
        var rubric_names = adminViewAssessmentTask.rubric_names;
        var assessment_tasks = adminViewAssessmentTask.assessment_tasks;

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
                    customBodyRender: (assessment_task_name) => {
                        return(
                            <>
                                {assessment_task_name ? assessment_task_name : "N/A"}
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
                    customBodyRender: (due_date) => {
                        var date = new Date(due_date);

                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();

                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

                        var minutesString = minute < 10 ? ("0" + minute): minute;
                        var twelveHourClock = hour < 12 ? "am": "pm";

                        var timeString = `${hour % 12}:${minutesString}${twelveHourClock}`;

                        var due_date_string = `${monthNames[month]} ${day} at ${timeString}`;

                        return(
                            <>
                                {due_date && due_date_string ? due_date_string : "N/A"}
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
                    customBodyRender: (role_id) => {
                        return (
                            <>
                                {role_names && role_id ? role_names[role_id] : "N/A"}
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
                    customBodyRender: (rubric_id) => {
                        return (
                            <>
                                {rubric_names && rubric_id ? rubric_names[rubric_id] : "N/A"}
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
                                {suggestions ? (suggestions ? "Yes" : "No") : "No"}
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
                    customBodyRender: (unit_of_assessment) => {
                        return(
                            <>
                                {unit_of_assessment ? "Yes" : "No"}
                            </>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "EDIT",
                options: {
                    filter: true,
                    sort: false,
                    setCellHeaderProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"100px", className:"button-column-alignment"} },
                    customBodyRender: (assessment_task_id) => {
                        if (assessment_task_id && assessment_tasks && chosenCourse && rubric_names) {
                            return (
                                <IconButton id=""
                                onClick={() => {
                                    setAddAssessmentTaskTabWithAssessmentTask(
                                        assessment_tasks,
                                        assessment_task_id,
                                        chosenCourse,
                                        role_names,
                                        rubric_names
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
                    customBodyRender: (assessment_task_id) => {
                        if (assessment_task_id && assessment_tasks) {
                            return(
                                <IconButton id=""
                                onClick={() => {
                                    setCompleteAssessmentTaskTabWithID(
                                        assessment_tasks,
                                        assessment_task_id
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
            }
        ]

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "45vh"
        };

        return(
            <>
                <CustomDataTable
                    data={assessment_tasks ? assessment_tasks : []}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewAssessmentTasks;
