import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

class ViewAssessmenTasks extends Component {
    render() {
        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    customBodyRender: (due_date) => {
                        var date = new Date(due_date);
                        var month = date.getMonth() - 1;
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                            >
                                {`${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`}
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
                            <p className='mt-3' variant='contained'>{this.props.role_names ? this.props.role_names[role_id]:""}</p>
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
                            <p className='mt-3' variant="contained">{this.props.rubric_names ? this.props.rubric_names[rubric_id]:""}</p>
                        )
                    }
                }
            },
            {
                name: "suggestions",
                label: "Uses Suggestions?",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p>{value===null ? "N/A" : (value ? "Yes" : "No")}</p>
                        )
                    }
                }
            },
            {
                name: "ratings",
                label: "Show Ratings?",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p>{value===null ? "N/A" : (value ? "Yes" : "No")}</p>
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
                    customBodyRender: (value) => {
                        return (
                            <button
                                id={value}
                                className='editTaskButton btn btn-primary'
                                onClick={() => {
                                    this.props.setAddAssessmentTaskTabWithAssessmentTask(
                                        this.props.assessment_tasks,
                                        value,
                                        this.props.chosenCourse,
                                        this.props.role_names,
                                        this.props.rubric_names
                                    )
                                }}
                            >
                                Edit
                            </button>
                        )
                    },    
                }
            },
            {
                name: "assessment_task_id",
                label: "VIEW",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {
                        return(
                            <button
                                className='btn btn-primary'
                                variant='contained'
                                onClick={() => {
                                    this.props.setCompleteAssessmentTaskTabWithID(this.props.assessment_tasks, value);
                                    this.props.setNewTab("ViewComplete");
                                }}
                            >
                                View
                            </button>
                        )
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
            tableBodyMaxHeight: "21rem"
        };
        return(
            <React.Fragment>
                <MUIDataTable data={this.props.assessment_tasks ? this.props.assessment_tasks : []} columns={columns} options={options}/>
            </React.Fragment>
        )
    }
}

export default ViewAssessmenTasks;