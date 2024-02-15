import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import CustomDataTable from '../../../Components/CustomDataTable';



class ViewCompleteAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;
        var completedAssessmentTasks = navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks;
        var userNames = navbar.adminViewCompleteAssessmentTasks.userNames;
        var state = navbar.state;
        var chosenAssessmentTask = state.chosenAssessmentTask;

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
                                variant='contained'
                                align='center'
                            >
                                {chosenAssessmentTask ? chosenAssessmentTask["assessment_task_name"] : "N/A"}
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
                    customBodyRender: (teamId) => {
                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align='center'
                            >
                                {teamId ? teamId : "N/A"}
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
                    customBodyRender: (userId) => {
                        return(
                            <p
                                className='mt-3'
                                variant="contained"
                                align="center"
                            >
                                {userNames && userId ? userNames[userId] : "N/A"}
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
                    customBodyRender: (dueDate) => {
                        var date = new Date(dueDate);
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var initialTimeString = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;

                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align="center"
                            >
                                {dueDate && initialTimeString ? initialTimeString : "N/A"}
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
                    customBodyRender: (lastUpdate) => {
                        var date = new Date(lastUpdate);
                        var month = date.getMonth();
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = date.getMinutes();
                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
                        var lastUpdateString = `${monthNames[month]} ${(day)} at ${hour%12}:${minute<10?("0"+minute):minute}${hour<12?"am":"pm"}`;

                        return(
                            <p
                                className='mt-3'
                                variant='contained'
                                align='center'
                            >
                                {lastUpdate && lastUpdateString ? lastUpdateString : "N/A"}
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
                    customBodyRender: (completedAssessmentId) => {
                        if (completedAssessmentId) {
                            return (
                                <button
                                    className='btn btn-primary'
                                    align='center'
                                    onClick={() => {
                                        navbar.setViewCompleteAssessmentTaskTabWithAssessmentTask(
                                            completedAssessmentTasks,
                                            completedAssessmentId,
                                            chosenAssessmentTask
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
                                    variant='contained'
                                    align='center'
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
            responsive: "vertical",
            tableBodyMaxHeight: "21rem"
        };

        return (
            <CustomDataTable
                data={completedAssessmentTasks ? completedAssessmentTasks : []}
                columns={columns}
                options={options}
            />
        )
    }
}

export default ViewCompleteAssessmentTasks;
