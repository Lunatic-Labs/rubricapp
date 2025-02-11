import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET, createEventSource } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading.js';
import { generateUnitList, UnitType } from './unit.js';
import { CheckinsTracker } from './cat_utils.js';



/**
 * CompleteAssessmentTask component is responsible for rendering and managing the state of the complete assessment task view.
 * It fetches necessary resources and handles the logic for displaying the assessment task details, including rubrics, teams, users, and completed assessments.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.navbar - The navbar object containing the state of the chosen course and assessment task.
 * 
 * @property {Object} state - The state of the component.
 * 
 * Set by GenericResourceFetch API:
 * @property {string|null} state.errorMessage - The error message if any error occurs during resource fetching.
 * @property {boolean} state.isLoaded - Indicates whether the resources have been loaded.
 * 
 * Resources fetched in componentDidMount:
 * @property {Object|null} state.assessmentTaskRubric - The rubric of the assessment task.
 * @property {Array|null} state.teams - The list of teams.
 * @property {Object|null} state.userFixedTeam - The "fixed" team of the current user.
 * @property {Array|null} state.users - The list of users.
 * @property {Array|null} state.teamsUsers - The list of users in teams.
 * @property {Object|null} state.currentUserRole - The role of the current user.
 * @property {Array|null} state.completedAssessments - The list of completed assessments.
 * 
 * Additional state properties:
 * @property {string|null} state.currentUserId - The ID of the current user.
 * @property {boolean} state.usingTeams - Indicates whether the assessment task is using teams.
 * @property {boolean} state.usingAdHoc - Indicates if we are using adHoc teams. Note usingteams truth affects this var.
 * @property {Object|null} state.checkins - The CheckinsTracker object.
 * @property {Object|null} state.checkinEventSource - The EventSource for checkin events.
 * @property {Array|null} state.unitList - The list of units for the assessment task.
 * @property {int|null} state.jumpId - What team or student to open first.
 */

class Debug {
    static data = {};

    static increment(that){
        ++Debug.data[that];
    }
    static firstZero(that){
        if(Debug.data[that] === undefined){
            Debug.data[that] = 0;
            return true;
        }
        else return false;
    }
    static change(that, val){
        try{
            Debug.data[that] = val;
        }catch{
            return false;
        }
    }
    static get(that){
        return Debug.data[that];
    }
}
if(module.hot){
    Debug.data = {};
}

class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            
            assessmentTaskRubric: null,
            teams: null,
            userFixedTeam: null,
            users: null,
            teamsUsers: null,
            currentUserRole: null,
            completedAssessments: null,
            
            currentUserId: null,
            usingTeams: this.props.navbar.state.unitOfAssessment,
            usingAdHoc: !this.props.navbar.state.chosenCourse.use_fixed_teams && this.props.navbar.state.unitOfAssessment,
            numberOfAdhocTeams: null,
            checkins: new CheckinsTracker(JSON.parse("[]")), // Null does not work since we get stuck in a loop in prod.
                                                             // The loop happens due to server caching as per testing.
            checkinEventSource: null,
            unitList: null,

            jumpId: this.props.navbar.state.jumpToSection // The desired jump location student assessment tasks.
        };
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const chosenCourse = state.chosenCourse;
        const cookies = new Cookies();
        const adHocMode = this.state.usingAdHoc;

        this.currentUserId = cookies.get("user")["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this, { dest: "assessmentTaskRubric" }
        );

        genericResourceGET(
            `/role?user_id=${this.currentUserId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this, { dest: "currentUserRole" }
        );

        if (adHocMode){
            const numOfTeams = chosenAssessmentTask.number_of_teams;
            let teamData = {};
            for(let i = 0; i < numOfTeams; ++i){
                teamData[i] = {
                    'active_until': null,
                    'course_id': chosenCourse.course_id,
                    'date_created': chosenAssessmentTask.due_date,
                    'observer_id':chosenCourse.admin_id,
                    'team_id': i,
                    'team_name': "Team "+ (i + 1),
                }
            }
            this.setState({
                teams: teamData,
            })

            genericResourceGET(
                `/team/adhoc?assessment_task_id=${chosenAssessmentTask.assessment_task_id}`,
                "teams", this
            ).then(response =>{
                let teamId = 0;
                if(response.teams){
                    teamId = response.teams.find(teams => teams.user_id === this.currentUserId)?.team_number??null;
                }
                for(let i = 0; i < numOfTeams; ++i){
                    teamData[i].team_users = (i === teamId - 1) ? [navbar.props.userName.split(" ")[0]] : [];
                }
                this.setState({
                    userFixedTeam: teamData,
                })
            }).catch (error => {
                console.log("error getting/formating adhoc data:",error);
            });
        }else{
            if (!cookies.get("user")["isAdmin"] && !cookies.get("user")["isSuperAdmin"]) {
                genericResourceGET(
                    `/team_by_user?user_id=${this.currentUserId}&course_id=${chosenCourse["course_id"]}`,
                    "teams", this, { dest: "userFixedTeam" }
                );
            }
    
            genericResourceGET(
                `/team?course_id=${chosenCourse["course_id"]}`,
                "teams", this
            ).then((result) => {
                if (this.state.usingTeams && result.teams && result.teams.length > 0) {
                    const teamIds = result.teams.map(team => team.team_id);
    
                    genericResourceGET(
                        `/user?team_ids=${teamIds}`,
                        "teams_users", this, { dest: "teamsUsers" }
                    );
                }
            });
        }
    
        genericResourceGET(
            `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
            "users", this
        );

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.usingTeams ? "team" : "individual"}`,
            "completed_assessments", this, { dest: "completedAssessments" }
        );
        
        const checkinEventSource = createEventSource(
            `/checkin_events?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
            ({data}) => {
                this.setState({
                    checkins: new CheckinsTracker(JSON.parse(data)),
                });
            }
        );
        
        this.setState({
            checkinEventSource: checkinEventSource,
        });
    }
    
    componentWillUnmount() {
        this.state.checkinEventSource?.close();
    }
    
    componentDidUpdate() { 

        if (!Debug.firstZero("UPDATE")){
            Debug.increment("UPDATE");
        }
        console.log("update iter : ", Debug.get("UPDATE"));

        if (this.state.unitList === null) {
            const {
                assessmentTaskRubric,
                teams,
                userFixedTeam,
                users,
                teamsUsers,
                currentUserRole,
                completedAssessments,
                checkins
            } = this.state; 
            
            if (assessmentTaskRubric && completedAssessments && currentUserRole && users && teams && checkins) {
                const navbar = this.props.navbar;
                const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];
                const chosenAssessmentTask = navbar.state.chosenAssessmentTask;
                const roleName = currentUserRole["role_name"];
                
                if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) return;
                if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) return;
                if (roleName === "Student" && this.state.usingTeams && !userFixedTeam) return;
                if (this.state.usingTeams && !teamsUsers) return;
                
                const unitList = generateUnitList({
                    roleName: roleName,
                    currentUserId: this.currentUserId,
                    chosenCompleteAssessmentTask: navbar.state.chosenCompleteAssessmentTask,
                    unitType: this.state.usingTeams ? UnitType.FIXED_TEAM : UnitType.INDIVIDUAL,
                    assessmentTaskRubric: assessmentTaskRubric,
                    completedAssessments,
                    users,
                    fixedTeams: teams,
                    fixedTeamMembers: teamsUsers,
                    // userFixedTeam is actually a list of a single team,
                    //   so index to get the first entry of the list.
                    userFixedTeam: userFixedTeam?.[0],
                });
                
                this.setState({
                    unitList,
                });
            }
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,

            assessmentTaskRubric,
            teams,
            userFixedTeam,
            users,
            teamsUsers,
            currentUserRole,
            completedAssessments,
            checkins,
            //usingAdHoc, will i want to pass it to form.js ?
        } = this.state;

        const navbar = this.props.navbar;
        const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];
        const chosenAssessmentTask = navbar.state.chosenAssessmentTask;

        if (errorMessage) {
            return (
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !assessmentTaskRubric || !completedAssessments || !currentUserRole || !users || !teams || !checkins) {
            return (
                <Loading />
            );

        } else if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) {
            return (
                <h1>Please create a team to complete this assessment.</h1>
            );

        } else if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) {
            return (
                <h1>Please add students to the roster to complete this assessment.</h1>
            );

        }

        const roleName = currentUserRole["role_name"];
        // console.warn("out of first elses");

        if (roleName === "Student" && this.state.usingTeams && !userFixedTeam){
            return (
                <Loading />
            );
        }

        if (roleName !== "Student" && this.state.usingTeams && !teamsUsers) {
            return (
                <Loading />
            );
        }

        // console.warn("student check esles");
        const unitList = this.state.unitList;
        console.assert(unitList !== null, `unitlist!== null instead got: ${unitList}`);

        if (!unitList) {
            return (
                <Loading />
            );
        }

        return (
            <Box>
                <Box className="assessment-title-spacing">
                    <Box className='d-flex flex-column justify-content-start'>
                        <h4>{assessmentTaskRubric["rubric_name"]}</h4>

                        <h5>{assessmentTaskRubric["rubric_description"]}</h5>
                    </Box>
                </Box>

                <Form
                    navbar={this.props.navbar}
                    roleName={this.state.currentUserRole["role_name"]}
                    checkins={this.state.checkins}
                    assessmentTaskRubric={assessmentTaskRubric}
                    units={unitList}
                    usingTeams={this.state.usingTeams}
                    jumpId={this.state.jumpId}
                />
            </Box>
        );
    }
}

export default CompleteAssessmentTask;
