import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Button } from '@mui/material';


class ViewAssessmentTasks extends Component {
    render() {
        var navbar = this.props.navbar;
        var studentViewAssessmentTask = navbar.studentViewAssessmentTask;
        var rubric_names = studentViewAssessmentTask.rubric_names;
        var assessment_tasks = studentViewAssessmentTask.assessment_tasks;

        const role = this.props.role; 

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
                    setCellHeaderProps: () => { return { width:"140px"}},
                    setCellProps: () => { return { width:"140px"} },
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
                    setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"}},
                    setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment"} },
                    customBodyRender: (at_id) => {
                        return (
                            <div>
                                {assessment_tasks.find((at) => at.assessment_task_id === at_id).unit_of_assessment && role.role_id === 5 &&
                                    <Button
                                        style={{ marginRight: '10px' }}
                                        className='primary-color'
                                        variant='contained'
                                        onClick={() => {
                                            navbar.setConfirmCurrentTeam(assessment_tasks, at_id, this.props.checkin.indexOf(at_id) !== -1);
                                        }}
                                    >
                                        {this.props.checkin.indexOf(at_id) === -1 ? 'Check In' : 'Switch Teams'}
                                    </Button>
                                }
                                
                                <Button
                                    className='primary-color'
                                    variant='contained'
                                    disabled={this.props.checkin.indexOf(at_id) === -1 && (assessment_tasks.find((at) => at.assessment_task_id === at_id).unit_of_assessment) && role.role_id === 5} 
                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessment_tasks, at_id);
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
            selectableRows: "none",
            selectableRowsHeader: false,
            responsive: "vertical",
            tableBodyMaxHeight: "21rem"
        };

        return(
            <React.Fragment>
                <CustomDataTable
                    data={assessment_tasks ? assessment_tasks : []}
                    columns={columns}
                    options={options}
                />
            </React.Fragment>
        )
    }
}

export default ViewAssessmentTasks;
