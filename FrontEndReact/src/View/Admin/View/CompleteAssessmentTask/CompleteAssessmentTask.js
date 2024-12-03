import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET, createEventSource } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading.js';
import { generateUnitList, UnitType } from './unit.js';



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
            checkin: null,
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
    }

    componentDidUpdate() {
        var navbar = this.props.navbar;

        var chosenAssessmentTask = navbar.state.chosenAssessmentTask;

        var unitOfAssessment = chosenAssessmentTask["unit_of_assessment"];

        if (unitOfAssessment && this.state.rubrics && this.state.teams && this.state.users === null) {
            // The Chosen Assessment will be completed for teams!
            // Thus do the logic to get all of the students on those teams!
            var teamIds = [];

            for (var index = 0; index < this.state.teams.length; index++) {
                teamIds = [...teamIds, this.state.teams[index]["team_id"]];

                genericResourceGET(
                    `/user?team_ids=${teamIds}`,
                    "users", this
                );
            }

            if (this.state.teams.length === 0)
                this.setState({
                    "users": []
                });
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
                var teamIds = result.teams.map(team => team.team_id);

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
                    checkin: JSON.parse(data),
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
            checkin
        } = this.state;

        var navbar = this.props.navbar;

        const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];

        var chosenAssessmentTask = navbar.state.chosenAssessmentTask;

        if (errorMessage) {
            return (
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !rubrics || !completedAssessments || !roles || !users || !teams || !checkin) {
            return (
                <Loading />
            );

        } else if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) {
            return (
                <h1>Please create a team to complete this assessment.</h1>
            )

        } else if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) {
            return (
                <h1>Please add students to the roster to complete this assessment.</h1>
            )

        } 
        var role_name=roles["role_name"]
        if (role_name === "Student" && this.state.unitOfAssessment && !team){
            return (
                <Loading />
            );
        }
        if (role_name !== "Student" && this.state.unitOfAssessment && !teams_users) {
            return (
                <Loading />
            );  
        } else { 
            let unitList = this.state.unitList;
            
            if (unitList === null) {
                unitList = generateUnitList({
                    roleName: role_name,
                    userId: this.userId,
                    chosenCompleteAssessmentTask: navbar.state.chosenCompleteAssessmentTask,
                    unitType: this.state.unitOfAssessment ? UnitType.FIXED_TEAM : UnitType.INDIVIDUAL,
                    rubric: rubrics,
                    completedAssessments,
                    users,
                    fixedTeams: teams,
                    fixedTeamMembers: teams_users,
                    userFixedTeam: team?.[0],
                    checkin,
                });
                
                this.setState({
                    unitList,
                });
            }

            return (
                <Box>
                    <Box className="assessment-title-spacing">
                        <Box className='d-flex flex-column justify-content-start' aria-label="completeAssessmentTaskNameTitle">
                            <h4>{rubrics["rubric_name"]}</h4>

                            <h5>{rubrics["rubric_description"]}</h5>
                        </Box>
                    </Box>

                    <Form
                        navbar={this.props.navbar}

                        unitOfAssessment={this.state.unitOfAssessment}

                        role_name={this.state.roles["role_name"]}

                        checkin={this.state.checkin}

                        form={{
                            "rubric": rubrics,
                            "units": unitList,
                        }}

                        formReference={this}

                        handleDone={this.handleDone}

                        completedAssessments={completedAssessments}
                    />
                </Box>
            )
        }
    }
}

export default CompleteAssessmentTask;
