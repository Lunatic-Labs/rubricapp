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
            errorMessage: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            team: null,
            users: null,
            teams_users: null,
            unitOfAssessment: this.props.navbar.state.unitOfAssessment,
            roles: null,
            completedAssessments: null,
            checkins: null, // CheckinsTracker object
            userId: null,
            checkinEventSource: null,
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
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCourse = state.chosenCourse;
    
        const cookies = new Cookies();

        this.userId = cookies.get('user')["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this
        );

        genericResourceGET(
            `/role?user_id=${this.userId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this
        );

        if (chosenAssessmentTask["role_id"] === 5) {
            genericResourceGET(
                `/team_by_user?user_id=${this.userId}&course_id=${chosenCourse["course_id"]}`,
                "teams", this, {dest: "team"}
            );
        }

        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        ).then((result) => {
            if (this.state.unitOfAssessment && result.teams && result.teams.length > 0) {
                const teamIds = result.teams.map(team => team.team_id);

                genericResourceGET(
                    `/user?team_ids=${teamIds}`,
                    "teams_users", this
                );
            }
        });
    
        genericResourceGET(
            `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
            "users", this
        );

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.unitOfAssessment ? "team" : "individual"}`,
            "completed_assessments", this, {dest: "completedAssessments"}
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
                rubrics,
                teams,
                team,
                users,
                teams_users,
                roles,
                completedAssessments,
                checkins
            } = this.state;
            
            if (rubrics && completedAssessments && roles && users && teams && checkins) {
                const navbar = this.props.navbar;
                const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];
                const chosenAssessmentTask = navbar.state.chosenAssessmentTask;
                const roleName = roles["role_name"];
                
                if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) return;
                if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) return;
                if (roleName === "Student" && this.state.unitOfAssessment && !team) return;
                if (this.state.unitOfAssessment && !teams_users) return;
                                
                const unitList = generateUnitList({
                    roleName: roleName,
                    userId: this.userId,
                    chosenCompleteAssessmentTask: navbar.state.chosenCompleteAssessmentTask,
                    unitType: this.state.unitOfAssessment ? UnitType.FIXED_TEAM : UnitType.INDIVIDUAL,
                    rubric: rubrics,
                    completedAssessments,
                    users,
                    fixedTeams: teams,
                    fixedTeamMembers: teams_users,
                    // team is actually a list of a single team,
                    //   so index to get the first entry of the list.
                    userFixedTeam: team?.[0],
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
            rubrics,
            teams,
            team,
            users,
            teams_users,
            roles,
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

        } else if (!isLoaded || !rubrics || !completedAssessments || !roles || !users || !teams || !checkins) {
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
        
        const roleName = roles["role_name"];
        
        if (roleName === "Student" && this.state.unitOfAssessment && !team){
            return (
                <Loading />
            );
        }
        
        if (roleName !== "Student" && this.state.unitOfAssessment && !teams_users) {
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
                        <h4>{rubrics["rubric_name"]}</h4>

                        <h5>{rubrics["rubric_description"]}</h5>
                    </Box>
                </Box>

                <Form
                    navbar={this.props.navbar}

                    unitOfAssessment={this.state.unitOfAssessment}

                    role_name={this.state.roles["role_name"]}

                    checkins={this.state.checkins}

                    form={{
                        "rubric": rubrics,
                        "units": unitList,
                    }}

                    formReference={this}

                    handleDone={this.handleDone}

                    completedAssessments={completedAssessments}
                />
            </Box>
        );
    }
}

export default CompleteAssessmentTask;
