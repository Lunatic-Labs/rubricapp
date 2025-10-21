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
            var userTeamIds = this.props.userTeamIds;

            if(completedAssessments) {
                for (let i = 0; i < completedAssessments.length; i++) {
                    const cat = completedAssessments[i];
                    if (cat.assessment_task_id === atId && cat.done === true) {
                        // For individual assessments (team_id is null), any completion counts
                        if (cat.team_id === null) {
                            return true;
                        }
                
                        // For team assessments, only count if it's the user's team
                        if (userTeamIds && userTeamIds.includes(cat.team_id)) {
                            return true;
                        }
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
                name: "unit_of_assessment",
                label: "Unit of Assessment",
                options: {
                    filter: true,
                    setCellHeaderProps: () => { return { width:"270px"}},
                    setCellProps: () => { return { width:"270px"} },
                    customBodyRender: (isTeam) => {
                        return (
                            <p className='mt-3' variant="contained">
                                {isTeam ? "Team" : "Individual"}
                            </p>
                        )
                    }
                },
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
                        let at = assessmentTasks.find((at) => at["assessment_task_id"] === atId);
                        let filledByStudent = at.role_id === 5;
                        
                        // Check if user is switching teams (already checked in)
                        const isSwitchingTeams = this.props.checkin.indexOf(atId) !== -1;

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
                                            const hasPassword = at.create_team_password && at.create_team_password.trim() !== '';
                                            const needsPasswordPrompt = isSwitchingTeams && hasPassword; // if just checking in, don't password prompt. if no password set, don't password prompt
                                            
                                            if (needsPasswordPrompt) {
                                                navbar.setConfirmCurrentTeam(assessmentTasks, atId, true);
                                            } else {
                                                navbar.setSelectCurrentTeam(assessmentTasks, atId);
                                            }
                                        }}
                                    >
                                        {isSwitchingTeams ? 'Switch Teams' : 'Check In'}
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
                                        ((this.props.checkin.indexOf(atId) === -1 &&
                                        (assessmentTasks.find((at) => at["assessment_task_id"] === atId)["unit_of_assessment"])) ||
                                        this.isObjectFound(atId) === true || !filledByStudent)
                                    :
                                        this.areAllATsComplete(atId) === true
                                    }
                                    onClick={() => {
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId, chosenCAT);
                                    }}

                                    aria-label="startAssessmentTasksButton"
                                >
                                    START
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