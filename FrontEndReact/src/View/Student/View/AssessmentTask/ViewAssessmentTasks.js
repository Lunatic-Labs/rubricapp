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

        this.areAllATsComplete = (atId) => {
            // Contains all Assessments completed by the TA
            var completedAssessments = this.props.completedAssessments.filter(at => at.assessment_task_id === atId);

            var assessmentTasks = this.props.assessmentTasks.filter(at => at.assessment_task_id === atId);

            var count = 0;
            if (assessmentTasks["unit_of_assessment"]) {          // Team Assessment
                if (assessmentTasks["number_of_teams"] !== null)  // If the number of teams is specified, use that
                {
                    count = assessmentTasks["number_of_teams"]
                } else {                                          // Otherwise, use the number of fixed teams    
                    count = this.props.counts[1];
                }
            } else {
                count = this.props.counts[0];
            }

            if (completedAssessments.length === 0) {
                return false;
            }
            if(completedAssessments) {
                if (completedAssessments.length < count) {
                    return false;
                }
                for (let i = 0; i < completedAssessments.length; i++) {
                    if (completedAssessments[i].assessment_task_id === atId && completedAssessments[i].done === false) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

    render() {
        var navbar = this.props.navbar;

        const fixedTeams = this.props.navbar.state.chosenCourse["use_fixed_teams"];

        const role = this.props.role;

        var chosenCAT = null;

        if (role["role_id"] === 5) {
            chosenCAT = this.props.completedAssessments;
        }
        var assessmentTasks = this.props.assessmentTasks;

        const columns = [
            {
                name: "assessment_task_name",
                label: "Task Name",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"300x"}},
                    setCellProps: () => { return { width:"300px"} },
                }
            },
            {
                name: "due_date",
                label: "Due Date",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"170px"}},
                    setCellProps: () => { return { width:"170px"} },
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
                    setCellHeaderProps: () => { return { width:"270px"}},
                    setCellProps: () => { return { width:"270px"} },
                    customBodyRender: (rubricId) => {
                        return (
                            <p className='mt-3' variant="contained">
                                {this.props.rubricNames ? this.props.rubricNames[rubricId]:""}
                            </p>
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
                                            display:  role["role_id"] === 5 ? "block" : "none"
                                        }}

                                        variant='contained'

                                        onClick={() => {
                                            if (!fixedTeams && navbar.state.team === null) {
                                                navbar.setSelectCurrentTeam(assessmentTasks, atId)
                                            } else {
                                                navbar.setConfirmCurrentTeam(assessmentTasks, atId, this.props.checkin.indexOf(atId) !== -1);
                                            }
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
                                    
                                    disabled={role["role_id"] === 5 ? 
                                        (this.props.checkin.indexOf(atId) === -1 && 
                                        (assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"])) || 
                                        this.isObjectFound(atId) === true 
                                    :
                                        this.areAllATsComplete(atId) === true
                                    }
                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId, chosenCAT);
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
