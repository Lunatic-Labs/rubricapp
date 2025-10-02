import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { Box, Typography, Button, Alert } from '@mui/material';
import { genericResourceGET } from '../../utility.js';
import StudentCompletedAssessmentTasks from './View/CompletedAssessmentTask/StudentCompletedAssessmentTasks.js';
import Loading from '../Loading/Loading.js';
import Cookies from 'universal-cookie';

// StudentDashboard is used for both students and TAs.
// StudentDashboard component is a parent component that renders the StudentViewAssessmentTask,
// StudentCompletedAssessmentTasks, and depending on the role, either the StudentViewTeams or
// the TAViewTeams components.

/**
 *  @description This component pulls the CATs & ATs, filters them, then sends them
 *                  to its children components.
 * 
 *  @property {object} roles - Possess the current users role_id and role_name;
 *  @property {Array}  assessmentTasks - All the related ATs to this course & user.
 *  @property {Array}  completedAssessments - All the related CATs to this course & user.
 *  @property {Array}  filteredATs - All valid ATs for the course and user.
 *  @property {Array}  filteredCATs - All valid CATs for the course and user.
 * 
 */

/**
 * TODO:
 * Noticed that the front-end student views utilize .find() a lot. It is not inherently wrong; the time 
 *  complexity, however, is O(N) so converting to these [object, Map, Set] might be more useful in the
 *  long run. Because the creation of those data structs is independent, then we could leverage 
 *  the power of awaiting [Promise.all].
 */

class StudentDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: null, 
            assessmentTasks: null,
            completedAssessments: null,
            filteredATs: null,
            filteredCATs: null,
        }
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenCourse = state.chosenCourse["course_id"];
        const userRole = state.chosenCourse.role_id;

        genericResourceGET( `/role?course_id=${chosenCourse}`, 'roles', this);
        
        genericResourceGET(
            `/assessment_task?course_id=${chosenCourse}`,
            "assessment_tasks", this, { dest: "assessmentTasks" }
        );

        // For a student, the role_id is not added calling a different route.
        const routeToCall = `/completed_assessment?course_id=${chosenCourse}${userRole === 5 ? "" : `&role_id=${userRole}`}`; 
        
        genericResourceGET(
            routeToCall,
            "completed_assessments", this, { dest: "completedAssessments" }
        );
    }

    componentDidUpdate() {
        const {
            filteredATs, 
            roles,
            assessmentTasks,
            completedAssessments,
        } = this.state;

        const filterATsAndCATs = roles && assessmentTasks && completedAssessments && (filteredATs === null);

        if (filterATsAndCATs) {
            // Remove ATs where the ID matches one of the IDs
            // in the CATs (ATs that are completed/locked/past due are shifted to CATs).
            let filteredCompletedAsseessments = [];
            
            const CATmap = new Map();
            const roleId = roles["role_id"];
            completedAssessments.forEach(cat => {CATmap.set(cat.assessment_task_id, cat)});
            
            const currentDate = new Date();
            const isATDone = (cat) => cat !== undefined && cat.done;
            const isATPastDue = (at, today) => (new Date(at.due_date)) < today; 

            let filteredAssessmentTasks = assessmentTasks.filter(task => {
                const cat =  CATmap.get(task.assessment_task_id);
                
                // Qualites for if an AT is viewable.
                const done = isATDone(cat);
                const correctUser = (roleId === task.role_id || (roleId === 5 && task.role_id ===4));
                const locked = task.locked;                                
                const published = task.published;
                const pastDue = !correctUser || locked || !published || isATPastDue(task, currentDate) ; //short-circuit

                const viewable = !done && correctUser && !locked && published && !pastDue;
                const CATviewable = correctUser===false && done===false;
                
                if (!viewable && !CATviewable && cat !== undefined) {    // TA/Instructor CATs will appear when done.
                    filteredCompletedAsseessments.push(cat); 
                }

                return viewable;
            });

            this.setState({
                filteredATs: filteredAssessmentTasks,
                filteredCATs: filteredCompletedAsseessments,
            });
        }
    }

    // Add method to handle switching back to admin
    handleSwitchBack = () => {
        console.log('=== SWITCHING BACK TO ADMIN ===');
        
        const cookies = new Cookies();
        const adminCredentialsStr = sessionStorage.getItem('adminCredentials');
        
        if (!adminCredentialsStr) {
            console.error('No admin credentials found!');
            alert('Admin credentials not found. Please login again.');
            window.location.href = '/login';
            return;
        }
        
        const adminCredentials = JSON.parse(adminCredentialsStr);
        console.log('Restoring admin:', adminCredentials.user);
        
        // Clear test student cookies
        cookies.remove('access_token', { path: '/' });
        cookies.remove('refresh_token', { path: '/' });
        cookies.remove('user', { path: '/' });
        
        // Restore admin cookies
        cookies.set('access_token', adminCredentials.access_token, { 
            path: '/', 
            sameSite: 'strict' 
        });
        cookies.set('refresh_token', adminCredentials.refresh_token, { 
            path: '/', 
            sameSite: 'strict' 
        });
        cookies.set('user', adminCredentials.user, { 
            path: '/', 
            sameSite: 'strict' 
        });
        
        // Clear saved data from sessionStorage
        sessionStorage.removeItem('adminCredentials');
        sessionStorage.removeItem('chosenCourse');
        sessionStorage.removeItem('testStudentCourse');
        
        console.log('Admin cookies restored');
        
        // Reload to apply changes
        window.location.reload();
    };

    render() {
        const {
            roles,
            assessmentTasks,
            completedAssessments,
            filteredATs,
            filteredCATs, 
        } = this.state; 

        // Check if viewing as test student
        const cookies = new Cookies();
        const user = cookies.get('user');
        const isViewingAsStudent = user?.viewingAsStudent;

        // Wait for information to be filtered.
        if (filteredATs === null || filteredCATs === null) {
            return <Loading />
        }

        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;

        // Note: The [My Assessment Tasks] & [Completed Assessments] each require exactly one of of the filtered objects.
        //      The reason stems from them needing an original list to properly bind data.
        return (
            <>
                {/* Switch Back Alert - Only shows when viewing as test student */}
                {isViewingAsStudent && (
                    <Alert 
                        severity="info"
                        sx={{ 
                            mb: 3,
                            mx: 2,
                            alignItems: 'center'
                        }}
                        action={
                            <Button 
                                color="inherit" 
                                size="small"
                                variant="outlined"
                                onClick={this.handleSwitchBack}
                                sx={{ 
                                    fontWeight: 'bold',
                                    borderColor: 'currentColor',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                    }
                                }}
                            >
                                Switch Back to Admin
                            </Button>
                        }
                    >
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Viewing as Test Student
                        </Typography>
                        <Typography variant="body2">
                            ID: {user.user_id} | Email: {user.email}
                        </Typography>
                    </Alert>
                )}

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
                            role={roles}
                            filteredAssessments={filteredATs}
                            CompleteAssessments={completedAssessments}
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
                        {[4, 5].includes(roles["role_id"]) &&
                            <StudentCompletedAssessmentTasks
                                navbar={navbar}
                                role={roles}
                                assessmentTasks={assessmentTasks}
                                filteredCompleteAssessments={filteredCATs}
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
                        {roles["role_id"] === 5 &&
                            <StudentViewTeams
                                navbar={navbar}
                            />
                        }
                        {roles["role_id"] === 4 &&
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