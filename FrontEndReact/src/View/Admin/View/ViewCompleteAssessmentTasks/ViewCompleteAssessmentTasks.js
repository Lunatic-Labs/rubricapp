import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../Add/AddUsers/addStyles.css';
import MUIDataTable from 'mui-datatables';

class ViewCompleteAssessmentTasks extends Component {
    render() {
        var complete_assessment_tasks = this.props.complete_assessment_tasks;
        const columns = [
            {
                name: "assessment_task_id",
                label: "Assessment Task",
                options: {
                    filter: true,
                    customBodyRender: () => {
                        return(
                            <p className='mt-3' variant="contained">{this.props.chosen_assessment_task["assessment_task_name"]}</p>
                        )
                    }
                }
            },
            {
                name: "by_role",
                label: "Role By",
                options: {
                    filter: true,
                    customBodyRender: (by_role) => {
                        return(
                            <p className='mt-3' variant="contained">{this.props.role_names ? this.props.role_names[by_role] : "N/A"}</p>
                        )
                    }
                }
            },
            {
                name: "team_or_user",
                label: "Team or User",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p className='mt-3' variant="contained">{value===null ? "N/A": (value ? "Team":"User") }</p>
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
                            <p className='mt-3' variant="contained">{team_id===null ? "N/A" : team_id}</p>
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
                            <p className='mt-3' variant="contained">{user_id===null ? "N/A" : this.props.user_names[user_id]}</p>
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
                name: "last_update",
                label: "Last Updated",
                options: {
                    filter: true,
                    customBodyRender: (last_update) => {
                        var date = new Date(last_update);
                        var month = date.getMonth() - 1;
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var last_update_string = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;
                        return(
                            <p className='mt-3' variant='contained'>{last_update ? last_update_string : "N/A"}</p>
                        )
                    }
                }
            },
            // Because each category has its own rating and each rubric has many categories,
            //  the rating stored needs to be a json, therefore should only be shown when on the View to see more details
            // {
            //     // Currently a sum, however not helpful for the user to view a total
            //     // Maybe the average rating of all categories
            //     name: "rating_summation",
            //     label: "Total Rating",
            //     options: {
            //         filter: true,
            //     }
            // },
            // Not shown for now, Admin will need to click on View to see more details
            // {
            //     name: "oc_data",
            //     label: "Observable Characteristics Data",
            //     options: {
            //         filter: true,
            //     }
            // },
            // {
            //     name: "sfi_data",
            //     label: "Suggestions for Improvement Data",
            //     options: {
            //         filter: true,
            //     }
            // },
            {
                name: "completed_assessment_id",
                label: "See More Details",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (cr_id) => {
                        return (
                            <button
                                className='btn btn-primary'
                                onClick={() => {
                                    this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask(complete_assessment_tasks, cr_id, this.props.chosen_assessment_task);
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
        return (
            <>
                <MUIDataTable
                    data={complete_assessment_tasks}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewCompleteAssessmentTasks;