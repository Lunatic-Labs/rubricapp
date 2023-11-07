import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../Add/AddUsers/addStyles.css';
import MUIDataTable from 'mui-datatables';

class ViewCompleteAssessmentTasks extends Component {
    render() {
        var completed_assessment_tasks = this.props.complete_assessments;
        const columns = [
            {
                name: "assessment_task_id",
                label: "Assessment Task",
                options: {
                    filter: true,
                    customBodyRender: () => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {this.props.chosen_assessment_task ? this.props.chosen_assessment_task["assessment_task_name"] : "N/A"}
                            </p>
                        )
                    }
                }
            }, 
            {
                name: "by_role",
                label: "Completed By",
                options: {
                    filter: true,
                    customBodyRender: (by_role) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {this.props.roles && by_role ? this.props.roles[by_role] : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "team_id",
                label: "Team",
                options: {
                    filter: true,
                    customBodyRender: (team_id) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {team_id ? team_id : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "user_id",
                label: "User",
                options: {
                    filter: true,
                    customBodyRender: (user_id) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {this.props.users[user_id] ? this.props.users[user_id] : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "initial_time",
                label: "Initial Time",
                options: {
                    filter: true,
                    customBodyRender: (due_date) => {
                        var date = new Date(due_date);
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var initial_time_string = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align="center"
                            >
                                {due_date && initial_time_string ? initial_time_string : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "last_update",
                label: "Last Updated",
                options: {
                    filter: true,
                    customBodyRender: (last_update) => {
                        var date = new Date(last_update);
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var last_update_string = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align="center"
                            >
                                {last_update && last_update_string ? last_update_string : "N/A"}
                            </p>
                        )
                    }
                }
            },
            {
                name: "completed_assessment_id",
                label: "See More Details",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (completed_assessment_id) => {
                        if (completed_assessment_id) {
                            return (
                                    <>
                                        <button
                                            className='btn btn-primary'
                                            onClick={() => {
                                                this.props.navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                                    completed_assessment_tasks,
                                                    completed_assessment_id,
                                                    this.props.chosen_assessment_task
                                                );
                                            }}
                                        >
                                            View
                                        </button>
                                    </>
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
        return (
            <>
                <MUIDataTable
                    data={completed_assessment_tasks}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewCompleteAssessmentTasks;