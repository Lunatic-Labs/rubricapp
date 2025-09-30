// StudentDashboard.js
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams.js';
import TAViewTeams from './View/TAViewTeams.js';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask.js';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';
import { genericResourceGET, parseRubricNames } from '../../utility.js';
import StudentCompletedAssessmentTasks from './View/CompletedAssessmentTask/StudentCompletedAssessmentTasks.js';
import Loading from '../Loading/Loading.js';

/**
 * EXPLICIT rubric-color mapping for ALL rubrics provided.
 * Each rubric name maps to exactly one hex color.
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
      filteredAverageData: null,

      // rubric grouping + colors
      rubrics: null,
      rubricNames: null,
      chartData: null,
      rubricColorsByName: {},

      // teammate’s addition: capture user’s team ids
      userTeamIds: null,
    };
  }

  // teammate’s addition: callback to capture team IDs from StudentViewTeams
  updateUserTeamsIds = (teamIds) => {
    this.setState({ userTeamIds: teamIds });
  };

  componentDidMount() {
    const navbar = this.props.navbar;
    const state = navbar.state;
    const chosenCourse = state.chosenCourse["course_id"];
    const userRole = state.chosenCourse.role_id;

    genericResourceGET(`/role?course_id=${chosenCourse}`, 'roles', this);
    genericResourceGET(`/assessment_task?course_id=${chosenCourse}`, "assessment_tasks", this, { dest: "assessmentTasks" });

    const routeToCall = `/completed_assessment?course_id=${chosenCourse}${userRole === 5 ? "" : `&role_id=${userRole}`}`;
    genericResourceGET(routeToCall, "completed_assessments", this, { dest: "completedAssessments" });

    genericResourceGET(`/average?course_id=${chosenCourse}`, "average", this, { dest: "averageData" });

    // rubric metadata for name & color mapping
    genericResourceGET(`/rubric?all=${true}`, "rubrics", this, { dest: "rubrics" });
  }

  componentDidUpdate() {
    const {
      filteredATs,
      roles,
      assessmentTasks,
      completedAssessments,
      averageData,
      rubrics,
      rubricNames,
      userTeamIds,
    } = this.state;

    // compute once when all data is present
    const canFilter = roles && assessmentTasks && completedAssessments && averageData && rubrics && (filteredATs === null);

    // teammate’s constraint: wait for userTeamIds (unless TA role 4)
    if (canFilter && (userTeamIds || (roles && roles.role_id === 4))) {
      const rubricNameMap = rubricNames ?? parseRubricNames(rubrics);
      const rubricColorsByName = { ...RUBRIC_COLOR_MAP };

      let filteredCompletedAssessments = [];
      let filteredAvgData = [];

      const CATmap = new Map();
      const AVGmap = new Map();

      const roleId = roles["role_id"];

      // teammate’s CAT filtering by team: if TA (role 4) include all; otherwise include only CATs for user’s teams or no team (null)
      completedAssessments.forEach(cat => {
        const team_id = cat.team_id;
        if (roleId === 4 || team_id === null || (Array.isArray(userTeamIds) && userTeamIds.includes(team_id))) {
          CATmap.set(cat.assessment_task_id, cat);
        }
      });
      averageData.forEach(cat => { AVGmap.set(cat.assessment_task_id, cat); });

      const currentDate = new Date();
      const isATDone = (cat) => cat !== undefined && cat.done;
      const isATPastDue = (at, today) => (new Date(at.due_date)) < today;

      const filteredAssessmentTasks = assessmentTasks.filter(task => {
        const cat = CATmap.get(task.assessment_task_id);
        const avg = AVGmap.get(task.assessment_task_id);

        const done = isATDone(cat);
        const correctUser = (roleId === task.role_id || (roleId === 5 && task.role_id === 4));
        const locked = task.locked;
        const published = task.published;
        const pastDue = !correctUser || locked || !published || isATPastDue(task, currentDate);

        const viewable = !done && correctUser && !locked && published && !pastDue;
        const CATviewable = correctUser === false && done === false;

        if (!viewable && !CATviewable && cat !== undefined) {
          filteredCompletedAssessments.push(cat);
          filteredAvgData.push(avg);
        }

        return viewable;
      });

      // helpers
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

          const createdDate = getCreatedDate(at, cat);
          const lastUpdatedTs = cat.last_update || cat.initial_time || at?.due_date;
          const rubric_id = at?.rubric_id ?? null;
          const rubricName = rubric_id != null ? rubricNameMap?.[rubric_id] : undefined;

          return {
            key: String(cat.completed_assessment_id ?? (at && at.assessment_task_id) ?? i),
            name: at?.assessment_task_name || `AT ${cat.assessment_task_id}`,
            dateLabel: fmtDate(lastUpdatedTs),
            avg: typeof avg === 'number' ? Number(avg.toFixed(2)) : null,
            rubric_id,
            rubricName,
            createdDate,
          };
        })
        .filter(d => d.avg !== null);

      // group by rubric NAME (alpha), then oldest → newest within each group
      chartDataCore.sort((a, b) => {
        const an = (a.rubricName || '').localeCompare(b.rubricName || '');
        if (an !== 0) return an;
        return (a.createdDate?.getTime?.() ?? 0) - (b.createdDate?.getTime?.() ?? 0);
      });

      const chartData = [];
      for (let i = 0; i < chartDataCore.length; i++) {
        const cur = chartDataCore[i];
        const prev = chartDataCore[i - 1];
        if (i > 0 && prev?.rubricName !== cur?.rubricName) {
          chartData.push({
            key: `spacer-${cur.rubricName}-${i}`,
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
        filteredAverageData: filteredAvgData,
        rubricNames: rubricNameMap,
        chartData,
        rubricColorsByName,
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
      chartData,
      rubricColorsByName,
    } = this.state;

    // wait for filtering
    if (filteredATs === null || filteredCATs === null || filteredAverageData === null) {
      return <Loading />;
    }

    const navbar = this.props.navbar;
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch" }}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch" }}>
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch" }}>
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
                // teammate’s addition: wire team-id callback so CAT filtering respects membership
                updateUserTeamsIds={this.updateUserTeamsIds}
              />
            }
            {roles["role_id"] === 4 &&
              <TAViewTeams navbar={navbar} />
            }
          </Box>
        </Box>

        {roles["role_id"] === 5 &&
          <Box className="page-spacing">
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", alignSelf: "stretch" }}>
              <Box sx={{ width: "100%" }} className="content-spacing">
                <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="averageRatings">
                  Skill Development Progress
                </Typography>
              </Box>
            </Box>

            <div className={innerDivClassName} style={{ ...innerGridStyle, minHeight: '300px' }}>
              <h6 style={{ margin: 0, padding: '1px', lineHeight: 1 }}>
                <u>Completed Task Averages Over Time</u>
              </h6>
              <div style={{ width: '100%', height: '260px', flexGrow: 1 }}>
                {chartData && chartData.length ? (
                  <ResponsiveContainer>
                    <BarChart
                      data={chartData}
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
                      <Bar dataKey="avg">
                        <LabelList
                          dataKey="avg"
                          position="top"
                          fill="#000"
                          stroke="none"
                          formatter={(v) => (typeof v === 'number' ? v.toFixed(2) : v)}
                        />
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.isSpacer ? "transparent" : (rubricColorsByName?.[entry.rubricName] || "#2e8bef")}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <Typography variant="body2" sx={{ mt: 2 }}>No completed task ratings yet.</Typography>
                )}
              </div>
            </div>
          </Box>
        }
      </>
    );
  }
}

export default StudentDashboard;