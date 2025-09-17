import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer, Tooltip } from 'recharts';
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
 *  @property {Array}  averageData  - Averages for all completed assessment task rubrics.
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
            averageData: null,
            filteredAverageData: null,
        
            chartData: null,
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

        genericResourceGET(
            `/average?course_id=${chosenCourse}`,
            "average", this, { dest: "averageData" }
        );
    }

    componentDidUpdate() {
        const {
            filteredATs, 
            roles,
            assessmentTasks,
            completedAssessments,
            averageData,
        } = this.state;

        const filterATsAndCATs = roles && assessmentTasks && completedAssessments && averageData && (filteredATs === null);

        if (filterATsAndCATs) {
            // Remove ATs where the ID matches one of the IDs
            // in the CATs (ATs that are completed/locked/past due are shifted to CATs).
            let filteredCompletedAssessments = [];
            let filteredAvgData = [];

            const CATmap = new Map();
            const AVGmap = new Map();
            const roleId = roles["role_id"];
            completedAssessments.forEach(cat => {CATmap.set(cat.assessment_task_id, cat)});
            averageData.forEach(cat => {AVGmap.set(cat.assessment_task_id, cat)});

            const currentDate = new Date();
            const isATDone = (cat) => cat !== undefined && cat.done;
            const isATPastDue = (at, today) => (new Date(at.due_date)) < today; 

            let filteredAssessmentTasks = assessmentTasks.filter(task => {
                const cat =  CATmap.get(task.assessment_task_id);
                const avg = AVGmap.get(task.assessment_task_id);
                
                // Qualites for if an AT is viewable.
                const done = isATDone(cat);
                const correctUser = (roleId === task.role_id || (roleId === 5 && task.role_id ===4));
                const locked = task.locked;                                
                const published = task.published;
                const pastDue = !correctUser || locked || !published || isATPastDue(task, currentDate) ; //short-circuit

                const viewable = !done && correctUser && !locked && published && !pastDue;
                const CATviewable = correctUser===false && done===false;
                
                if (!viewable && !CATviewable && cat !== undefined) {    // TA/Instructor CATs will appear when done.
                    filteredCompletedAssessments.push(cat);
                    filteredAvgData.push(avg);
                }

                return viewable;
            });
            const computeAvg = (avgObj) => {
                if (avgObj == null) return null;
                if (typeof avgObj === 'number') return avgObj;
                if (typeof avgObj?.average === 'number') return avgObj.average;
                if (typeof avgObj?.avg === 'number') return avgObj.avg;
                if (typeof avgObj?.overall_average === 'number') return avgObj.overall_average;
                if (avgObj?.averages && typeof avgObj.averages === 'object') {
                    const vals = Object.values(avgObj.averages).map(Number).filter(v => !Number.isNaN(v));
                    if (vals.length) return vals.reduce((a, b) => a + b, 0) / vals.length;
                }
                if (typeof avgObj?.value === 'number') return avgObj.value;
                return null;
            };

            const fmtDate = (ts) => {
                try {
                    const d = new Date(ts);
                    if (!isNaN(d)) return d.toLocaleDateString();
                } catch (e) {}
                return 'N/A';
            };

            const chartData = filteredCompletedAssessments
                .map((cat, i) => {
                    const avgObj = filteredAvgData[i];
                    const at = assessmentTasks.find(a => a.assessment_task_id === cat.assessment_task_id);
                    const avg = computeAvg(avgObj);
                    const ts = cat.last_update || cat.initial_time || (at && at.due_date);
                    const dateObj = ts ? new Date(ts) : new Date(0);
                    return {
                        key: String(cat.completed_assessment_id ?? (at && at.assessment_task_id) ?? i),
                        name: at?.assessment_task_name || `AT ${cat.assessment_task_id}`,
                        date: dateObj,
                        dateLabel: fmtDate(ts),
                        avg: typeof avg === 'number' ? Number(avg.toFixed(2)) : null,
                    };
                })
                .filter(d => d.avg !== null)
                ;

            this.setState({

                filteredATs: filteredAssessmentTasks,
                filteredCATs: filteredCompletedAssessments,
                filteredAverageData: filteredAvgData,
            
                chartData,
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
            filteredAverageData,
        } = this.state; 

        // Wait for information to be filtered.
        if (filteredATs === null || filteredCATs === null || filteredAverageData === null) {
            return <Loading />
        }

        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;
        
        console.log(filteredAverageData);

        const innerGridStyle = {
          borderRadius: '1px',
          height: '100%',
          border: "#7F7F7F", 
          padding: 0,
          margin: 0,
          boxShadow: "0.3em 0.3em 1em #d6d6d6"
        };

        const innerDivClassName = 'd-flex flex-column p-3 w-100 justify-content-center align-items-center';

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

                {roles["role_id"] === 5 &&
                    <Box className="page-spacing">
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            alignSelf: "stretch"
                        }}>
                            <Box sx={{ width: "100%" }} className="content-spacing">
                                <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="averageRatings">
                                    Average Ratings
                                </Typography>
                            </Box>
                        </Box>

{
      <div className={innerDivClassName} style={{ ...innerGridStyle, minHeight: '300px' }}>
        <h6 style={{ margin: 0, padding: '1px', lineHeight: 1 }}>
          <u>Completed Task Average Ratings</u>
        </h6>
        <div style={{ width: '100%', height: '260px', flexGrow: 1 }}>
          {this.state.chartData && this.state.chartData.length ? (
            <ResponsiveContainer>
              <BarChart
                data={this.state.chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                barSize={40}
              >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" hide />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} style={{ fontSize: '0.75rem' }} />
                <Tooltip formatter={(v) => [typeof v === 'number' ? v.toFixed(2) : v, 'Avg Rating']} labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label} />
                <Bar dataKey="avg" fill="#2e8bef">
                  <LabelList dataKey="avg" position="top" formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>No completed task ratings yet.</Typography>
          )}
        </div>
      </div>
}
                    </Box>
                }
            </>
        )
    }
}

export default StudentDashboard;
