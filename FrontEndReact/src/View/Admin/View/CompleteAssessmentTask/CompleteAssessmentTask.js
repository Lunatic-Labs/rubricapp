import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET, createEventSource } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading.js';
import { generateUnitList, UnitType } from './unit.js';
<<<<<<< HEAD
=======
import { CheckinsTracker } from './cat_utils.js';
>>>>>>> master



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
 * @property {Object|null} state.checkins - The CheckinsTracker object.
 * @property {Object|null} state.checkinEventSource - The EventSource for checkin events.
 * @property {Array|null} state.unitList - The list of units for the assessment task.
 */
class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set by genericResourceFetch API
            errorMessage: null,
            isLoaded: false,
            
            assessmentTaskRubric: null,
            teams: null,
<<<<<<< HEAD
            team: null,
=======
            userFixedTeam: null,
>>>>>>> master
            users: null,
            teamsUsers: null,
            currentUserRole: null,
            completedAssessments: null,
            
            currentUserId: null,
            usingTeams: this.props.navbar.state.unitOfAssessment,
            checkins: null,
            checkinEventSource: null,
<<<<<<< HEAD
            unitList: null, // List of ATUnit objects
        }
            this.doRubricsForCompletedMatch = (newCompleted, storedCompleted) => {
            var newCompletedCategories = Object.keys(newCompleted).sort();

            var storedCompletedCategories = Object.keys(storedCompleted).sort();

            if (newCompletedCategories.length !== storedCompletedCategories.length) {
                return false;
            }

            for (var index = 0; index < newCompletedCategories.length; index++) {
                if (newCompletedCategories[index] !== storedCompletedCategories[index]) {
                    return false;
                }
            }

            return true;
        }

        this.getCompleteTeam = (teamId) => {
            var completedTeam = this.state.completedAssessments.find(completedAssessment => completedAssessment["team_id"] === teamId);
            
            return completedTeam ? completedTeam : false;
        }

        this.getCompleteIndividual = (userId) => {
            var completedAssessment = this.state.completedAssessments.find(completedAssessment => completedAssessment["user_id"] === userId);

            return completedAssessment ? completedAssessment : false;
        }

        this.handleDone = () => {
            var navbar = this.props.navbar;
            let chosenAssessmentTask = null;
            
            if (navbar.state.chosenCompleteAssessmentTask && navbar.state.chosenCompleteAssessmentTask.assessment_task_id) {   
                chosenAssessmentTask = navbar.state.chosenCompleteAssessmentTask;
            } else if(navbar.state.chosenAssessmentTask && navbar.state.chosenAssessmentTask.assessment_task_id) {
                chosenAssessmentTask = navbar.state.chosenAssessmentTask;
            }
            
            if(!chosenAssessmentTask) {
                return;
            }
            
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.unitOfAssessment ? "team" : "individual"}`,
                "completed_assessments", this, {dest: "completedAssessments"}
            );
        }
=======
            unitList: null,
        };
>>>>>>> master
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const chosenCourse = state.chosenCourse;
        const cookies = new Cookies();

        this.currentUserId = cookies.get("user")["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this, { dest: "assessmentTaskRubric" }
        );

        genericResourceGET(
            `/role?user_id=${this.currentUserId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this, { dest: "currentUserRole" }
        );

        if (chosenAssessmentTask["role_id"] === 5) {
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
<<<<<<< HEAD
                rubrics,
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
                    userFixedTeam: team?.[0],
                    checkin,
=======
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
>>>>>>> master
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
<<<<<<< HEAD
            team,
=======
            userFixedTeam,
>>>>>>> master
            users,
            teamsUsers,
            currentUserRole,
            completedAssessments,
            
            checkins
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


        if (roleName === "Student" && this.state.usingTeams && !userFixedTeam){
>>>>>>> master
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

<<<<<<< HEAD
            return (
                <Box>
                    <Box className="assessment-title-spacing">
                        <Box className='d-flex flex-column justify-content-start' aria-label="completeAssessmentTaskNameTitle">
                            <h4>{rubrics["rubric_name"]}</h4>

                        <h5>{rubrics["rubric_description"]}</h5>
=======
        return (
            <Box>
                <Box className="assessment-title-spacing">
                    <Box className='d-flex flex-column justify-content-start'>
                        <h4>{assessmentTaskRubric["rubric_name"]}</h4>

                        <h5>{assessmentTaskRubric["rubric_description"]}</h5>
>>>>>>> master
                    </Box>
                </Box>

                <Form
                    navbar={this.props.navbar}
                    roleName={this.state.currentUserRole["role_name"]}
                    checkins={this.state.checkins}
                    assessmentTaskRubric={assessmentTaskRubric}
                    units={unitList}
>>>>>>> master
                />
            </Box>
        );
    }
}

export default CompleteAssessmentTask;
