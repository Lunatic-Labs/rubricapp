import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';


class ViewAssessmentTasks extends Component {
    
    render() {
        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    customBodyRender: (assessment_task_name) => {
                        return(
                            <p>{assessment_task_name ? assessment_task_name : "N/A"}</p>  
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
                            <p>
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
                            <p>
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
                            <p>
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
                            <p>
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
                            <p>
                                {suggestions ? (suggestions ? "Yes" : "No") : "No"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "unit_of_assessment",
                label: "Team Assessment?",
                options: {
                    filter: true,
                    customBodyRender: (unit_of_assessment) => {
                        return(
                            <p>
                                {unit_of_assessment ? (unit_of_assessment ? "Yes" : "No") : "No"}
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
                                <p>
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
                                <p>
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
            tableBodyMaxHeight: "70%"
        };
        return(
            <React.Fragment>
                <>
                    <CustomDataTable
                        data={this.props.assessment_tasks ? this.props.assessment_tasks : []}
                        columns={columns}
                        options={options}
                    />
                </>
            </React.Fragment>
        )
    }
}

export default ViewAssessmentTasks;
