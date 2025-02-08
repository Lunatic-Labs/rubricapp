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
 * @property {Object|null} state.userFixedTeam - The fixed team of the current user.
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


/*
    DELETE THIS AT THE END. Team is failing since its undefined. intergrating adhoc will break both this
    and form.js. Lack the routes to retrive the proper information too.

    changes : Onmount func now has a new if else to prevent crashing and retrive adhoc data.

    problems: stuck loading in adhoc locations bc there is no route yet for getting adhoc teams.

    admin view: adhoc form.js broken
    super view: pass
    ta    view: adhoc form.js broken
    stdent viw: adhoc form.js broken
*/



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
            //Left empty for the new routes that retrive the adhoc information.
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
            //usingAdHoc,
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
            console.warn("First loading bar");
            console.warn({
                loaded: isLoaded,//pass
                Atr: assessmentTaskRubric,//pass
                cat: completedAssessments,//pass
                userRole: currentUserRole,//pass
                usrs: users,//pass
                tms: teams,//null ERROR HERE -fix through the route data and poper formating/ logic change? no too much broken
                checkintruth: checkins,//pass
            });
            /** 
             * code for the teams; I need to ensure that all the pieces are structred in this manner
             * 
             * current backend can send me the checkin data for a certain AT.
             *  I have the AT
             *          atid
             *          atname
             *          courseid
             *          rubricid
             *          roleid
             *          duedate
             *          timezone
             *          suggestions
             *          unitofassessment
             *          comment
             *          createteam
             *          size
             *          numofteams
             *          noti
             * I have checkin
             *          id
             *          atid
             *          teamnum
             *          userid
             *          time
             * 
             * 0: Object { course_id: 1, date_created: "2023-01-01", observer_id: 3, … }
                active_until: null
                ​​​
                course_id: 1 //frontend already has it can still be bound using a at tabel join to checkins
                ​​​
                date_created: "2023-01-01" // time is the at creation time
                ​​​
                observer_id: 3 user id for now to get it working then fix it later with a join
                ​​​
                team_id: 1  // impossible? teamnum
                ​​​
                team_name: "Black Mambas"  "Team"+teamnum
            */

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

        const unitList = this.state.unitList;

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
