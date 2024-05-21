import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Box, Button } from '@mui/material';
import { getHumanReadableDueDate } from '../../../../utility';



class ViewAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.isObjectFound = (atId) => {
            var completedAssessments = this.props.completedAssessments;

            if(completedAssessments) {
                for (let i = 0; i < completedAssessments.length; i++) {
                    if (completedAssessments[i].assessment_task_id === atId && completedAssessments[i].done === true) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

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
                        let dueDateString = getHumanReadableDueDate(dueDate);

                        return(
                            <p className='mt-3' variant='contained'>
                                {dueDate ? dueDateString : "N/A"}
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
                            <Box
                                style={{
                                    display: "flex",
                                    flexFlow: "row wrap",
                                }}
                            >
                                {assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"] &&
                                    <Button
                                        className='primary-color'

                                        style={{
                                            width: "fit-content",
                                            margin: "5px",
                                            // display:  (assessmentTasks.find((at) => at["assessment_task_id"] === atId))["role_id"] === 5 ? "none" : "block"
                                            display:  role["role_id"] === 5 ? "none" : "block"
                                        }}

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

                                    style={{
                                        width: "fit-content",
                                        margin: "5px"
                                    }}

                                    variant='contained'
                                    //The first thing it checks is to see if the assessment_task id exists in array. The second thing checks to see if assessment_taks matches the id. The following thing is to check to see if the role_id equal student or if we complete an assessment.
                                    disabled={(this.props.checkin.indexOf(atId) === -1 && (assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"]) && role["role_id"] === 5) || this.isObjectFound(atId) === true} 

                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId);
                                    }}

                                    aria-label="completedAssessmentTasksButton"
                                >
                                    Complete
                                </Button>
                            </Box>
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
