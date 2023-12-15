import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

class ViewAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;
        var studentViewAssessmentTask = navbar.studentViewAssessmentTask;
        var rubric_names = studentViewAssessmentTask.rubric_names;
        var setViewCompleteAssessmentTaskTabWithAssessmentTask = navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask
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
                name: "rubric_id",
                label: "Rubric Used",
                options: {
                    filter: true,
                    customBodyRender: (rubric_id) => {
                        return (
                            <p className='mt-3' variant="contained">{rubric_names ? rubric_names[rubric_id]:""}</p>
                        )
                    }
                }
            },
            {
                name: "assessment_task_id",
                label: "TO DO",
                options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (at_id) => {
                        return(
                            <button
                                className='btn btn-primary'
                                variant='contained'
                                onClick={() => {
                                   	// NOTE: SKIL-161 Edited here with page destination 
									// setNewTab("BuildNewTeam");
                                    setViewCompleteAssessmentTaskTabWithAssessmentTask(null, null, null)
                                }}
                            >
                                Complete
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
            responsive: "standard",
            tableBodyMaxHeight: "21rem"
        };
        var assessment_tasks = studentViewAssessmentTask.assessment_tasks;
        return(
            <React.Fragment>
                <MUIDataTable
                    data={assessment_tasks ? assessment_tasks : []}
                    columns={columns}
                    options={options}
                />
            </React.Fragment>
        )
    }
}

export default ViewAssessmentTasks;
