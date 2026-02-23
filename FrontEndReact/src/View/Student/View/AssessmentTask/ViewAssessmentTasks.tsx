import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Box, Button } from '@mui/material';
import { getHumanReadableDueDate } from '../../../../utility';

/**
 * @description
 * Displays the "My Assessment Tasks" table for a student/TA.
 * This component:
 *  - Receives already-filtered assessmentTasks and completedAssessments from the parent
 *    (no fetches are done here).
 *  - Determines per-row completion state (for START button enable/disable).
 *  - Delegates all visual rendering/sorting to CustomDataTable.
 *
 * @prop {Object} navbar                  - Navbar instance for navigation helpers.
 * @prop {Object} role                    - Current user role (contains role_id).
 * @prop {Array}  assessmentTasks         - Assessment tasks to display (ATs).
 * @prop {Array}  completedAssessments    - Completed assessment tasks (CATs) relevant to these ATs.
 * @prop {Array}  rubricNames             - Map/object of rubric_id → rubric name (for "Rubric Used" column).
 * @prop {Array}  checkin                 - Array of assessment_task_ids the student has already checked into.
 * @prop {Array}  counts                  - Course counts (students/teams) used by areAllATsComplete().
 * @prop {Array}  userTeamIds             - IDs of teams the current student belongs to (for team AT logic).
 *
 * Notes on sorting:
 *  - Rows are passed directly to CustomDataTable in the order of assessmentTasks.
 *  - Column-level sorting (where enabled) is driven by the table component itself.
 *  - The "TO DO" column explicitly sets sort: false.
 */

interface ViewAssessmentTasksProps {
    navbar: any;
    role: any;
    assessmentTasks: any[];
    completedAssessments: any[];
    checkin: any[];
    rubricNames: any[];
    counts: any;
    userTeamIds: any[];
}

class ViewAssessmentTasks extends Component<ViewAssessmentTasksProps> {
    areAllATsComplete: any;
    isObjectFound: any;
    constructor(props: ViewAssessmentTasksProps) {
        super(props);

        /**
         * @method isObjectFound
         * @description
         * Returns true if there is at least one completed CAT for this assessment_task_id
         * that belongs to the current user (either their individual CAT or their team CAT).
         *
         * Used to disable the START button for students once their relevant team/individual
         * assessment is fully done.
         *
         * @param {number} atId - assessment_task_id to check.
         * @returns {boolean} True if a matching completed assessment is found and done.
         */

        this.isObjectFound = (atId: any) => {
            var completedAssessments = this.props.completedAssessments;

            if(completedAssessments) {
                const catsForThisTask = completedAssessments.filter((cat: any) => cat.assessment_task_id === atId);
        
                const userCatForThisTask = catsForThisTask.find((cat: any) => // For individual assessments, team_id will be null
                // For team assessments, find one that matches user's general teams
                cat.team_id === null || 
                (this.props.userTeamIds && this.props.userTeamIds.includes(cat.team_id))
                );
        
                if (userCatForThisTask) {
                    const userTeamId = userCatForThisTask.team_id;
            
                    // Now check if ANY completed assessment for this task with the same team is done
                    const teamIsDone = catsForThisTask.some((cat: any) => cat.done === true && 
                    (cat.team_id === userTeamId || (cat.team_id === null && userTeamId === null))
                    );
            
                    if (teamIsDone) {
                        return true;
                    }
                }
            }

            return false;
        };

        /**
         * @method areAllATsComplete
         * @description
         * For a given assessment_task_id, determines whether all required CATs have been completed.
         * This is used for the TA/Instructor view to decide whether the START button should be disabled.
         *
         * Logic:
         *  - Filters CATs and ATs down to this assessment_task_id.
         *  - Derives the expected count:
         *      * For team assessments:
         *          - Uses number_of_teams if present on the AT, otherwise counts[1] (fixed teams).
         *      * For individual assessments:
         *          - Uses counts[0] (number of students).
         *  - Returns true only if:
         *      * There is at least one CAT, and
         *      * The number of CATs matches the expected count, and
         *      * All CATs for this AT are marked done.
         *
         * @param {number} atId - assessment_task_id to check.
         * @returns {boolean} True if all expected CATs for this AT are completed.
         */
        
        this.areAllATsComplete = (atId: any) => {
            // Contains all Assessments completed by the TA
            var completedAssessments = this.props.completedAssessments.filter((at: any) => at.assessment_task_id === atId);

            var assessmentTasks = this.props.assessmentTasks.filter((at: any) => at.assessment_task_id === atId);

            var count = 0;
            const firstTask = assessmentTasks[0];
            if (firstTask && firstTask["unit_of_assessment"]) {          // Team Assessment
                if (firstTask["number_of_teams"] !== null)  // If the number of teams is specified, use that
                {
                    count = firstTask["number_of_teams"]
                } else {                                          // Otherwise, use the number of fixed teams
                    count = this.props.counts[1];
                }
            } else {
                count = this.props.counts[0];
            }

            if (completedAssessments.length === 0) {
                return false;
            }
            if (completedAssessments) {
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
        };
    }

    render() {
        var navbar = this.props.navbar;

        const role = this.props.role;

        var chosenCAT: any = null;

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
                    customBodyRender: (isTeam: any) => {
                        return (
                            <p className='mt-3'>
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
                    customBodyRender: (dueDate: any) => {
                        let dueDateString = getHumanReadableDueDate(dueDate);

                        return(
                            <p className='mt-3'>
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
                    customBodyRender: (rubricId: any) => {
                        return (
                            <p className='mt-3'>
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
                    customBodyRender: (atId: any) => {
                        let at = assessmentTasks.find((at: any) => at["assessment_task_id"] === atId);
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
                                {assessmentTasks.find((at: any) => at["assessment_task_id"] === atId)["unit_of_assessment"] &&
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
                                            const isFixedTeams = this.props.navbar.state.chosenCourse["use_fixed_teams"];

                                            if (isFixedTeams) {
                                                if (!isSwitchingTeams) {
                                                    // For check in: don't ask for password
                                                    navbar.setConfirmCurrentTeam(assessmentTasks, atId, false);
                                                } 
                                                else if (hasPassword) {
                                                    // Switching teams WITH password: ask for password
                                                    navbar.setConfirmCurrentTeam(assessmentTasks, atId, true);
                                                }
                                                else {
                                                    // Switching teams WITHOUT password: don't ask for password
                                                    navbar.setSelectCurrentTeam(assessmentTasks, atId);
                                                }
                                            }
                                            else {
                                                // For ad-hoc teams:

                                                if (isSwitchingTeams && hasPassword) {
                                                    // Switching teams WITH password: ask for password
                                                    navbar.setConfirmCurrentTeam(assessmentTasks, atId, true);
                                                }
                                                else {
                                                    // Checking in or switching without a password set: don't ask for password
                                                    navbar.setSelectCurrentTeam(assessmentTasks, atId);
                                                }
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
                                        (assessmentTasks.find((at: any) => at["assessment_task_id"] === atId)["unit_of_assessment"])) ||
                                        this.isObjectFound(atId) === true || !filledByStudent)
                                    :
                                        this.areAllATsComplete(atId) === true
                                    }
                                    onClick={() => {
                                        let relevantCAT = null;
                                        
                                        if (role["role_id"] === 5 && at.unit_of_assessment) {
                                            // For students on team assessments, find THEIR team's CAT
                                            
                                            relevantCAT = this.props.completedAssessments.find((cat: any) => cat.assessment_task_id === atId && 
                                            this.props.userTeamIds.includes(cat.team_id)
                                            );
                                        } else if (role["role_id"] === 5) {
                                            // For individual assessments, find their personal CAT
                                            relevantCAT = this.props.completedAssessments.find((cat: any) => cat.assessment_task_id === atId && 
                                            cat.team_id === null
                                            );
                                        } else {
                                            // For TAs, use chosenCAT as before
                                            relevantCAT = chosenCAT;
                                        }
                                        
                                        navbar.setAssessmentTaskInstructions(assessmentTasks, atId, relevantCAT);
                                    }}

                                    aria-label="startAssessmentTasksButton"
                                >
                                    START
                                </Button>
                            </Box>
                        );
                    }
                }
            }
        ];

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
