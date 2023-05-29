import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

class ViewAssessmenTasks extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
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
                name: "course_id",
                label: "Course ID",
                options: {
                    filter: true,
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                }
            },
            {
                name: "role_id",
                label: "Role ID",
                options: {
                    filter: true,
                }
            },
            {
                name: "rubric_id",
                label: "Rubric ID",
                options: {
                    filter: true,
                }
            },
            {
                name: "suggestions",
                label: "Uses Suggestions?",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p>{value ? "Yes":"No"}</p>
                        )
                    }
                }
            },
            {
                name: "at_id",
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
                                        this.props.course
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
                name: "at_id",
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
                                    // this.props.setCompleteAssessmentTaskTabWithID(this.props.assessment_tasks, value);
                                    console.log("View All Completed Assessments");
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
            responsive: "vertical"
        };
        return(
            <React.Fragment>
                <MUIDataTable data={this.props.assessment_tasks} columns={columns} options={options}/>
            </React.Fragment>
        )
    }
}

export default ViewAssessmenTasks;