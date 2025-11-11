import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer, Tooltip , Cell} from 'recharts';
import { Box, Typography } from '@mui/material';
import { genericResourceGET, parseRubricNames } from '../../utility.js';
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
 *  @property {Array}  fullyDoneCATS - All CATs that should display in the completed assessments section only.
 *  @property {Array}  userTeamIds - Figured out user teams.
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

const RUBRIC_COLOR_MAP = {
  "Critical Thinking": "#1f77b4",
  "Formal Communication": "#ff7f0e",
  "Information Processing": "#2ca02c",
  "Interpersonal Communication": "#9467bd",
  "Management": "#8c564b",
  "Problem Solving": "#d62728",
  "Teamwork": "#17becf",
  "Metacognition": "#bcbd22",
  "Questions": "#e377c2",
  "Experimenting": "#7f7f7f",
  "Mathematical thinking": "#393b79",
  "Modeling": "#637939",
  "Analyzing data": "#8c6d31",
  "Explaining phenomena": "#843c39",
  "Arguing": "#7b4173",
  "Disseminating findings": "#3182bd",
};

class StudentDashboard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            roles: null, 
            assessmentTasks: null,
            completedAssessments: null,
            averageData: null,

            filteredATs: null,
            filteredCATs: null,
            userTeamIds: [],
            fullyDoneCATS: null,

            // Added for rubric grouping
            rubrics: null,
            rubricNames: null,

            chartData: null,
        }
    }

    /**
     * Upates the team ids that the user is a part of.
     * @param {array} teamIds - Team ids that the user is a part of.
     */
    updateUserTeamsIds = (teamIds) => {
        this.setState({
            userTeamIds: teamIds,
            teamsFetched: true
        });
    }

    refreshCheckins = () => {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenCourse = state.chosenCourse["course_id"];
        
        // Reset filteredATs to null to trigger re-filtering
        this.setState({ 
            filteredATs: null,
            checkinTeamMap: null 
        });
        
        genericResourceGET(`/checkin?course_id=${chosenCourse}`, "checkin", this, { 
            dest: "checkins"
        });
    }

    componentDidMount() {
    const navbar = this.props.navbar;
    const state = navbar.state;
    const chosenCourse = state.chosenCourse["course_id"];
    const userRole = state.chosenCourse.role_id;

    genericResourceGET(`/role?course_id=${chosenCourse}`, 'roles', this);
    genericResourceGET(`/assessment_task?course_id=${chosenCourse}`, "assessment_tasks", this, { dest: "assessmentTasks" });
    
    const routeToCall = `/completed_assessment?course_id=${chosenCourse}${userRole === 5 ? "" : `&role_id=${userRole}`}`; 
    genericResourceGET(routeToCall, "completed_assessments", this, { dest: "completedAssessments" })
    
    genericResourceGET(`/average?course_id=${chosenCourse}`, "average", this, { dest: "averageData" });
    genericResourceGET(`/rubric?all=${true}`, "rubrics", this, { dest: "rubrics" });
        
    genericResourceGET(`/checkin?course_id=${chosenCourse}`, "checkin", this, { dest: "checkins" });
    }

    componentDidUpdate() {
        const {
            filteredATs, 
            roles,
            assessmentTasks,
            completedAssessments,
            userTeamIds,
            averageData,
            rubrics,
            rubricNames,
            checkins,
        } = this.state;

        const canFilter = roles && assessmentTasks && completedAssessments && averageData && rubrics && (filteredATs === null);
        if (!roles) {
            return;
        }

        const canFilterStudent = roles.role_id === 5 && (userTeamIds.length > 0 || this.state.teamsFetched);

        if (canFilter && (roles.role_id === 4 || canFilterStudent)) {
            const rubricNameMap = rubricNames ?? parseRubricNames(rubrics);

            let filteredCompletedAssessments = [];
            let filteredAvgData = [];
            let finishedCats = [];

            const CATmap = new Map();
            const AVGmap = new Map();
            const roleId = roles["role_id"];
            
            const getCATKey = (assessment_task_id, team_id, isTeamAssessment) => {
                if (isTeamAssessment && team_id !== null) {
                    return `${assessment_task_id}-${team_id}`;
                }
                return `${assessment_task_id}`;
            };

            const checkinTeamMap = new Map();
            if (checkins && Array.isArray(checkins)) {
                checkins.forEach(checkin => {
                    checkinTeamMap.set(checkin.assessment_task_id, checkin.team_number);
                });
            }

            completedAssessments.forEach(cat => {
                const team_id = cat.team_id;
                const at = assessmentTasks.find(task => task.assessment_task_id === cat.assessment_task_id);
                const isTeamAssessment = at?.unit_of_assessment === true;
                
                if (roles.role_id === 4) {
                    // TAs see everything
                    const key = getCATKey(cat.assessment_task_id, team_id, isTeamAssessment);
                    const existing = CATmap.get(key);
                    const shouldReplace = !existing || (cat.done && !existing.done);
                    if (shouldReplace) {
                        CATmap.set(key, cat);
                    }
                } else if (isTeamAssessment) {
                    // For team assessments, only include if this is the team they're checked in with
                    const checkedInTeamId = checkinTeamMap.get(cat.assessment_task_id);
                    if (checkedInTeamId === team_id) {
                        const key = getCATKey(cat.assessment_task_id, team_id, isTeamAssessment);
                        CATmap.set(key, cat);
                    }
                } else if (team_id === null) { //Individual asssessments
                    const key = getCATKey(cat.assessment_task_id, team_id, isTeamAssessment);
                    CATmap.set(key, cat);
                }
            });
            
            averageData.forEach(cat => { AVGmap.set(cat.assessment_task_id, cat) });

            const currentDate = new Date();
            const isATDone = (cat) => cat !== undefined && cat.done;
            const isATPastDue = (at, today) => (new Date(at.due_date)) < today; 

            let filteredAssessmentTasks = assessmentTasks.filter(task => {
                const isTeamAssessment = task.unit_of_assessment === true;
                let relevantTeamId = null;
                                
                if (isTeamAssessment) {
                    relevantTeamId = checkinTeamMap.get(task.assessment_task_id) || null;
                }
                
                const catKey = getCATKey(task.assessment_task_id, relevantTeamId, isTeamAssessment);
                const cat = CATmap.get(catKey);
                const avg = AVGmap.get(task.assessment_task_id);

                // For team assessments without check-in, still show in "My Assessment Tasks" 
                // so students can check in
                const needsCheckIn = isTeamAssessment && !relevantTeamId;
                
                const done = isATDone(cat);
                const correctUser = (roleId === task.role_id || (roleId === 5 && task.role_id === 4));
                const locked = task.locked;                                
                const published = task.published;
                const pastDue = !correctUser || locked || !published || isATPastDue(task, currentDate);

                // Show in "My Assessment Tasks" if:
                // - Not done AND user is correct AND not locked AND published AND not past due
                // OR for team assessments, if they need to check in
                const viewable = (!done && correctUser && !locked && published && !pastDue) || needsCheckIn;
                const CATviewable = correctUser === false && done === false;

                // Add to completed assessments if there's a CAT and it's either:
                // - Done (goes to "Completed Assessments")
                // - Not viewable but exists (goes to "Completed Assessments" - past due/locked)
                if (!CATviewable && cat !== undefined) {
                    if (done) {
                        filteredCompletedAssessments.push(cat);
                    } else {
                        finishedCats.push(cat);
                    }
                    filteredAvgData.push(avg);
                }

                return viewable;
            });

            // Helpers for chart data
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

            // helper: pick the *created* timestamp for the AT (fallbacks just in case)
            const getCreatedDate = (at, cat) => {
            const raw =
                at?.created_at ||
                at?.created_time ||
                at?.created ||
                at?.initial_time || 
                cat?.initial_time ||
                at?.due_date;        
            const d = raw ? new Date(raw) : new Date(0);
            return isNaN(d) ? new Date(0) : d;
            };

            let chartDataCore = filteredCompletedAssessments
                .map((cat, i) => {
                    const avgObj = filteredAvgData[i];
                    const at = assessmentTasks.find(a => a.assessment_task_id === cat.assessment_task_id);
                    const avg = computeAvg(avgObj);

                    const createdDate = getCreatedDate(at, cat); // creation date for ordering
                    const lastUpdatedTs = cat.last_update || cat.initial_time || at?.due_date;
                    const rubric_id = at?.rubric_id ?? null;
                    const rubricName = rubric_id != null ? rubricNameMap?.[rubric_id] : undefined;

                    return {
                        key: String(cat.completed_assessment_id ?? (at && at.assessment_task_id) ?? i),
                        name: at?.assessment_task_name || `AT ${cat.assessment_task_id}`,
                        dateLabel: fmtDate(lastUpdatedTs),
                        avg: typeof avg === 'number' ? Number(avg.toFixed(2)) : null,

                        // grouping + ordering fields
                        rubric_id,
                        rubricName,
                        createdDate,
                    };
                })
                .filter(d => d.avg !== null);

            // === Group by rubric, then by created (oldest → newest) ===
            chartDataCore.sort((a, b) => {
                const r = (a.rubric_id ?? 0) - (b.rubric_id ?? 0);
                if (r !== 0) return r;
                return (a.createdDate?.getTime?.() ?? 0) - (b.createdDate?.getTime?.() ?? 0);
            });

            const chartData = [];
            for (let i = 0; i < chartDataCore.length; i++) {
            const cur = chartDataCore[i];
            const prev = chartDataCore[i - 1];

            if (i > 0 && prev?.rubric_id !== cur?.rubric_id) {
                chartData.push({
                key: `spacer-${cur.rubric_id}-${i}`,
                name: '',
                avg: null,
                isSpacer: true,
                });
            }
            chartData.push(cur);
            }

            this.setState({
                filteredATs: filteredAssessmentTasks,
                filteredCATs: filteredCompletedAssessments,
                fullyDoneCATS: finishedCats,

                rubricNames: rubricNameMap,
                chartData,
                checkinTeamMap: checkinTeamMap,
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
            fullyDoneCATS,
            checkinTeamMap,
        } = this.state; 

        // Wait for information to be filtered.
        if (!roles) {
            return <Loading />
        }

        var navbar = this.props.navbar;
        navbar.refreshCheckins = this.refreshCheckins;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;

        const innerGridStyle = {
          borderRadius: '1px',
          height: '100%',
          border: "#7F7F7F", 
          padding: 0,
          margin: 0,
          boxShadow: "0.3em 0.3em 1em #d6d6d6"
        };

        const innerDivClassName = 'd-flex flex-column p-3 w-100 justify-content-center align-items-center';

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
                            userTeamIds={this.state.userTeamIds}
                            checkinTeamMap={checkinTeamMap}
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
                                filteredCompleteAssessments={fullyDoneCATS}
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
                                updateUserTeamsIds={this.updateUserTeamsIds}
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
                                    Skill Development Process
                                </Typography>
                            </Box>
                        </Box>

                        {
                          <div className={innerDivClassName} style={{ ...innerGridStyle, minHeight: '300px' }}>
                            <h6 style={{ margin: 0, padding: '1px', lineHeight: 1 }}>
                              <u>Completed Task Average Over Time</u>
                            </h6>
                            <div style={{ width: '100%', height: '260px', flexGrow: 1 }}>
                              {this.state.chartData && this.state.chartData.length ? (
                                <ResponsiveContainer>
                                  <BarChart
                                    data={this.state.chartData}
                                    margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                                    barSize={40}
                                    barCategoryGap="0%"  
                                  >
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" hide />
                                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} style={{ fontSize: '0.75rem' }} />
                                    <Tooltip
                                      content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                          const p = payload[0].payload;
                                          if (p.isSpacer) return null; 
                                          return (
                                            <div
                                              style={{
                                                background: 'white',
                                                border: '1px solid #d0d0d0',
                                                padding: '8px 10px',
                                                borderRadius: 4,
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                fontSize: '0.85rem'
                                              }}
                                            >
                                              <div style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                                              <div><strong>Rubric:</strong> {p.rubricName || 'N/A'}</div>
                                              <div><strong>Last updated:</strong> {p.dateLabel || 'N/A'}</div>
                                            </div>
                                          );
                                        }
                                        return null;
                                      }}
                                    />
                                    <Bar dataKey="avg" fill="#2e8bef">
                                      <LabelList dataKey="avg" position="top" style={{ fill: 'black' }} formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)} />
                                      {this.state.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={RUBRIC_COLOR_MAP[entry.rubricName]} />
                                      ))}
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