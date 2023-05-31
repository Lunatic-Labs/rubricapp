import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../Add/AddUsers/addStyles.css';
import MUIDataTable from 'mui-datatables';

class ViewCompleteAssessmentTasks extends Component {
    render() {
        var complete_assessment_tasks = this.props.complete_assessment_tasks;
        const columns = [
            {
                name: "at_id",
                // Evantually show Assessment Task Name
                // label: "Assessment Task ID",
                label: "ID",
                options: {
                    filter: true,
                }
            },
            {
                name: "by_role",
                label: "Role By",
                options: {
                    filter: true,
                }
            },
            {
                name: "team_or_user",
                label: "Team or User",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p className='mt-3' variant="contained">{value===null ? "N/A": (value===true ? "Yes":"No") }</p>
                        )
                    }
                }
            },
            {
                name: "team_id",
                label: "Team",
                options: {
                    filter: true,
                }
            },
            {
                name: "user_id",
                label: "User",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p className='mt-3' variant="contained">{value===null ? "N/A" : value}</p>
                        )
                    }
                }
            },
            {
                name: "initial_time",
                label: "Initial Time",
                options: {
                    filter: true,
                }
            },
            {
                name: "last_update",
                label: "Last Updated",
                options: {
                    filter: true,
                    customBodyRender: (value) => {
                        return(
                            <p className='mt-3' variant="contained">{value===null ? "N/A" : value}</p>
                        )
                    }
                }
            },
            {
                // Currently a sum, however not helpful for the user to view a total
                // Maybe the average rating of all categories
                name: "rating",
                label: "Rating",
                options: {
                    filter: true,
                }
            },
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
                name: "cr_id",
                label: "View",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (cr_id) => {
                        return (
                            <button
                                className='btn btn-primary'
                                onClick={() => {
                                    this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask(complete_assessment_tasks[0], cr_id, this.props.chosen_assessment_task);
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
                    // Currently passing in dummy data, until the Completed Assessment Routes is merged and connected!
                    data={complete_assessment_tasks[0]}
                    columns={columns}
                    options={options}
                />
            </>
        )
    }
}

export default ViewCompleteAssessmentTasks;