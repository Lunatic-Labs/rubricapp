import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Button } from '@mui/material';



class ViewAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;

        const role = this.props.role;

        var assessmentTasks = this.props.assessmentTasks;

        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"200x"}},
                    setCellProps: () => { return { width:"200px"} },
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"200px"}},
                    setCellProps: () => { return { width:"200px"} },
                    customBodyRender: (dueDate) => {
                        var date = new Date(dueDate);

                        var month = date.getMonth() - 1;

                        var day = date.getDate();

                        var hour = date.getHours();

                        var minute = date.getMinutes();

                        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

                        const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

                        const amPm = hour < 12 ? "am" : "pm";

                        return(
                            <p className='mt-3' variant='contained'>
                                {`${monthNames[month]} ${day} at ${formattedHour}:${minute < 10 ? ("0" + minute) : minute} ${amPm}`}
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
                    setCellHeaderProps: () => { return { width:"140px"}},
                    setCellProps: () => { return { width:"140px"} },
                    customBodyRender: (rubricId) => {
                        return (
                            <p className='mt-3' variant="contained">{this.props.rubricNames ? this.props.rubricNames[rubricId]:""}</p>
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
                    setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"} },
                    customBodyRender: (atId) => {
                        return (
                            <div>
                                {assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"] && role["role_id"] === 5 &&
                                    <Button
                                        style={{ marginRight: '10px' }}
                                        className='primary-color'
                                        variant='contained'

                                        onClick={() => {
                                            navbar.setConfirmCurrentTeam(assessmentTasks, atId, this.props.checkin.indexOf(atId) !== -1);
                                        }}
                                    >
                                        {this.props.checkin.indexOf(atId) === -1 ? 'Check In' : 'Switch Teams'}
                                    </Button>
                                }
                                
                                <Button
                                    className='primary-color'
                                    variant='contained'
                                    disabled={this.props.checkin.indexOf(atId) === -1 && (assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"]) && role["role_id"] === 5} 

                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId);
                                    }}
                                >
                                    Complete
                                </Button>
                    
                            </div>
                        )
                        
                    }
                }
            }
        ]

        const options = {
            onRowsDelete: false,
            download: false,
            print: false,
            viewColumns: false,
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem"
        };

        return(
            <CustomDataTable
                data={assessmentTasks ? assessmentTasks : []}
                columns={columns}
                options={options}
            />
        )
    }
}

export default ViewAssessmentTasks;
