import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../Add/AddUsers/addStyles.css';
import MUIDataTable from 'mui-datatables';

class ViewCompleteAssessmentTasks extends Component {
    render() {
        const columns = [
            {
                name: "at_id",
                label: "Assessment Task ID",
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
                }
            },
            {
                name: "rating",
                label: "Rating",
                options: {
                    filter: true,
                }
            },
            {
                name: "oc_data",
                label: "Observable Characteristics Data",
                options: {
                    filter: true,
                }
            },
            {
                name: "sfi_data",
                label: "Suggestions for Improvement Data",
                options: {
                    filter: true,
                }
            },
            {
                name: "cr_id",
                label: "View",
                options: {
                    filter: true,
                    sort: false,
                    customBodyRender: (value) => {
                        return (
                            <button className='btn btn-primary' onClick={() => {console.log(`View${value}`)}}>View</button>
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
        return (
            <>
                <MUIDataTable data={[]} columns={columns} options={options}/>
            </>
        )
    }
}

export default ViewCompleteAssessmentTasks;