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



class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Set by genericResourceFetch API
            errorMessage: null,
            isLoaded: false,
            
            // Resources fetched in componentDidMount
            assessmentTaskRubric: null,
            teams: null,
            userFixedTeam: null,
            users: null,
            teamsUsers: null,
            currentUserRole: null,
            completedAssessments: null,
            
            currentUserId: null,
            usingTeams: this.props.navbar.state.unitOfAssessment, // Whether the assessment task is using teams
            checkins: null, // CheckinsTracker object
            checkinEventSource: null,
            unitList: null, // List of ATUnit objects
        };
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
                    usingTeams={this.state.usingTeams}
                    roleName={this.state.currentUserRole["role_name"]}
                    checkins={this.state.checkins}
                    assessmentTaskRubric={assessmentTaskRubric}
                    units={unitList}
                />
            </Box>
        );
    }
}

export default CompleteAssessmentTask;
