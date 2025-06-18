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

    render() {
        const {
            roles,
            assessmentTasks,
            completedAssessments,
            filteredATs,
            filteredCATs, 
        } = this.state; 

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
