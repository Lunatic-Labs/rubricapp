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
            "assessmentTasks", this);

        if (userRole === 5) {
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourse}`,
                "completedAssessments", this
            );
        } else {
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourse}&role_id=${userRole}`,
                "completedAssessments", this);
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
        var assessmentTasks = this.state.assessmentTasks;
        var completedAssessments = this.state.completedAssessments;

        if (!role || !assessmentTasks || !completedAssessments) {
            return <Loading />
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
                        {role["role_id"] === 5 &&
                         <StudentCompletedAssessmentTasks
                             navbar={navbar}
                             role={role}
                         />
                        }
                        {role["role_id"] === 4 &&
                         <StudentCompletedAssessmentTasks
                             navbar={navbar}
                             role={role}
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
