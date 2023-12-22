import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask';
import { Box, Typography } from '@mui/material';
// The StudentDashboard component contains the two sub components of
// StudentViewAssessmentTask and StudentViewTeams!
// If additional components are needed, please add and import here!
class StudentDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <Box sx={{ 
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"}}>
                            <Box sx={{width: "100%"}} className="content-spacing">
                            <Typography sx={{fontWeight:'700'}} variant="h5"> 
                                My Assessment Tasks
                            </Typography>
                            </Box>
                    </Box>
                    <Box>
                        <StudentViewAssessmentTask
                            navbar={navbar}
                        />
                    </Box>
                </Box>
                <Box className="page-spacing">
                    <Box sx={{ 
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"}}>
                            <Box sx={{width: "100%"}} className="content-spacing">
                                <Typography sx={{fontWeight:'700'}} variant="h5"> 
                                    My Team
                                </Typography>
                            </Box>
                    </Box>
                    <Box>
                        <StudentViewTeams
                            navbar={navbar}
                        />
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default StudentDashboard;
