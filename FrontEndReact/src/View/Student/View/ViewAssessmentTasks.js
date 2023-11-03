import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

class ViewAssessmentTasks extends Component {
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
                                align="center"
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
                            <p className='mt-3' variant="contained" align="center">{this.props.rubrics ? this.props.rubrics[rubric_id] : ""}</p>
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
                                align="center"
                                onClick={() => {
                                    // SKIL-161-Confirm-Team Implements missing functionality here!
                                    console.log(at_id);
                                    console.log("Work in progress...");
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
        return(
            <React.Fragment>
                <MUIDataTable data={this.props.assessment_tasks ? this.props.assessment_tasks : []} columns={columns} options={options}/>
            </React.Fragment>
        )
    }
}

export default ViewAssessmentTasks;