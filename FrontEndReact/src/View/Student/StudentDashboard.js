import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { Box, Typography } from '@mui/material';
import { genericResourceGET } from '../../utility.js';
import StudentCompletedAssessmentTasks from './View/CompletedAssessmentTask/StudentCompletedAssessmentTasks.js';



class StudentDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenCourse = state.chosenCourse["course_id"];

        genericResourceGET(`/role?course_id=${chosenCourse}`, 'roles', this);
    }

    render() {
        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;

        var role = this.state.roles;

        return (
            <>
                {role &&
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
                                <StudentCompletedAssessmentTasks
                                    navbar={navbar}
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
                }
            </>
        )
    }
}

export default StudentDashboard;
