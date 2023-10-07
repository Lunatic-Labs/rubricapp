import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';


class ViewAssessmentTasks extends Component {
    getMuiTheme = () => createTheme({
        components: {
            MUIDataTableBodyCell: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#",
                        padding: '0px',
                        textalign: "center",

                        '&:nth-of-type(5)': {
                            backgroundColor: "",
                            // color: "blue",
                            height:"8px !important"
                        }
                    },
                    assessment_task_name: {
                        backgroundColor: "#2d367a",
                    }
                }
            }
        }
    })
    
    
    render() {
        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    customBodyRender: (assessment_task_name) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {assessment_task_name ? assessment_task_name : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    customBodyRender: (due_date) => {
                        var date = new Date(due_date);
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var due_date_string = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align="center"
                            >
                                {due_date && due_date_string ? due_date_string : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "role_id",
                label: "Completed By",
                options: {
                    filter: true,
                    customBodyRender: (role_id) => {
                        return (
                            <p
                                className='mt-3'
                                variant='contained'
                                align="center"
                            >
                                {this.props.role_names && role_id ? this.props.role_names[role_id] : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "rubric_id",
                label: "Rubric Used",
                options: {
                    filter: true,
                    customBodyRender: (rubric_id) => {
                        return (
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {this.props.rubric_names && rubric_id ? this.props.rubric_names[rubric_id] : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "show_ratings",
                label: "Show Ratings?",
                options: {
                    filter: true,
                    customBodyRender: (ratings) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {ratings ? (ratings ? "Yes" : "No") : "No"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "show_suggestions",
                label: "Show Improvements?",
                options: {
                    filter: true,
                    customBodyRender: (suggestions) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {suggestions ? (suggestions ? "Yes" : "No") : "No"}
                            </p>
                        )
                    }
                }
            },
			// Currently we hardcoded the "Team Assessment?" column to "No" because the database has not been updated to store actual data.
            {
                name: "unit_of_assessment",
                label: "Team Assessment?",
                options: {
                    filter: true,
                    customBodyRender: (team_assessment) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"                                
                            >
                                {team_assessment ? (team_assessment ? "Yes" : "No") : "No"}
                            </p>
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
                    customBodyRender: (assessment_task_id) => {
                        if (assessment_task_id && this.props.assessment_tasks && this.props.chosenCourse && this.props.rubric_names) {
                            return (
                                <button
                                    id={"assessment_task_edit_button_" + assessment_task_id}
                                    className='editTaskButton btn btn-primary'
                                    onClick={() => {
                                        this.props.setAddAssessmentTaskTabWithAssessmentTask(
                                            this.props.assessment_tasks,
                                            assessment_task_id,
                                            this.props.chosenCourse,
                                            this.props.role_names,
                                            this.props.rubric_names
                                        )
                                    }}
                                >
                                    Edit
                                </button>
                            )
                        } else {
                            return(
                                <p
                                    className='mt-3'
                                    variant="contained"
                                    align="center"
                                >
                                    {"N/A"}
                                </p>
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
                    customBodyRender: (assessment_task_id) => {
                        if (assessment_task_id && this.props.assessment_tasks) {
                            return(
                                <button
                                    className='btn btn-primary'
                                    variant='contained'
                                    onClick={() => {
                                        this.props.setCompleteAssessmentTaskTabWithID(
                                            this.props.assessment_tasks,
                                            assessment_task_id
                                        );
                                    }}
                                >
                                    View
                                </button>
                            )
                        } else {
                            return(
                                <p
                                    className='mt-3'
                                    variant="contained"
                                    align="center"
                                >
                                    {"N/A"}
                                </p>
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
            responsive: "standard",
            tableBodyMaxHeight: "21rem"
        };
        return(
            <React.Fragment>
                <ThemeProvider theme={this.getMuiTheme()}>
                    <MUIDataTable
                    data={
                        this.props.assessment_tasks ? this.props.assessment_tasks : []
                    }
                    columns={columns}
                    options={options}
                />
                </ThemeProvider>
            </React.Fragment>
        )
    }
}

export default ViewAssessmentTasks;
