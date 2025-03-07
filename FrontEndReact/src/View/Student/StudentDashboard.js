import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { Box, Typography } from '@mui/material';
import { genericResourceGET } from '../../utility.js';
import StudentCompletedAssessmentTasks from './View/CompletedAssessmentTask/StudentCompletedAssessmentTasks.js';
import Loading from '../Loading/Loading.js';

// StudentDashboard is used for both students and TAs.
// StudentDashboard component is a parent component that renders the StudentViewAssessmentTask,
// StudentCompletedAssessmentTasks, and depending on the role, either the StudentViewTeams or
// the TAViewTeams components.


class StudentDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: null,
            assessmentTasks: null,
            completedAssessments: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourse = state.chosenCourse["course_id"];

        genericResourceGET(
            `/role?course_id=${chosenCourse}`, 'roles', this);

        var userRole = state.chosenCourse.role_id;
        genericResourceGET(
            `/assessment_task?course_id=${chosenCourse}&role_id=${userRole}`,
            "assessment_tasks", this, { dest: "assessmentTasks" });

        if (userRole === 5) {
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourse}`,
                "completed_assessments", this, { dest: "completedAssessments" }
            );
        } else {
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourse}&role_id=${userRole}`,
                "completed_assessments", this, { dest: "completedAssessments" }
            );
        }
    }

    render() {
        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;

        var role = this.state.roles;

        let assessmentTasks = this.state.assessmentTasks;
        let completedAssessments = this.state.completedAssessments;

        // Wait for information to be retrieved from DB.
        if (!role || !assessmentTasks || !completedAssessments) {
            return <Loading />
        }

        // Remove ATs where the ID matches one of the IDs
        // in the CATs (that AT is completed, no need to display it).
        assessmentTasks = assessmentTasks.filter(task =>
            !completedAssessments.some(completed =>
                completed.assessment_task_id === task.assessment_task_id
            )
        );

        // Move the remaining (past due) ATs into the CATs
        // as well as any ATs that have been manually locked
        // by an admin.
        const currentDate = new Date();
        for (let i = 0; i < assessmentTasks.length; ++i) {
            if (!assessmentTasks[i].published) {
                assessmentTasks.splice(i, 1);
                --i;
            }
            else {
                const dueDate = new Date(assessmentTasks[i].due_date);
                if (dueDate < currentDate || assessmentTasks[i].locked) {
                    completedAssessments.push(assessmentTasks[i]);
                    assessmentTasks.splice(i, 1);
                    --i;
                }
            }
        }

        return (
            <>
                <Box className="page-spacing">
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"
                    }}>
                        <Box sx={{ width: "100%" }} className="content-spacing">
                            <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="myAssessmentTasksTitle">
                                My Assessment Tasks
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        <StudentViewAssessmentTask
                            navbar={navbar}
                            role={role}
                            filteredAssessments={assessmentTasks}
                            filteredCompleteAssessments={completedAssessments}
                        />
                    </Box>
                </Box>

                <Box className="page-spacing">
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"
                    }}>
                        <Box sx={{ width: "100%" }} className="content-spacing">
                            <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="completedAssessmentTasksTitle">
                                Completed Assessments
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        {[4, 5].includes(role["role_id"]) &&
                            <StudentCompletedAssessmentTasks
                                navbar={navbar}
                                role={role}
                                filteredAssessments={assessmentTasks}
                                filteredCompleteAssessments={completedAssessments}
                            />
                        }
                    </Box>
                </Box>

                <Box className="page-spacing">
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"
                    }}>
                        <Box sx={{ width: "100%" }} className="content-spacing">
                            <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="myTeamsTitle">
                                My Teams
                            </Typography>
                        </Box>
                    </Box>

                    <Box>
                        {role["role_id"] === 5 &&
                            <StudentViewTeams
                                navbar={navbar}
                            />
                        }
                        {role["role_id"] === 4 &&
                            <TAViewTeams
                                navbar={navbar}
                            />
                        }
                    </Box>
                </Box>
            </>
        )
    }
}

export default StudentDashboard;
