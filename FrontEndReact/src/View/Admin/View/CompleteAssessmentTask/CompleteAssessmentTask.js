import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading.js';



class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            users: null,
            unitOfAssessment: null,
            indiv_users: null,      // use if unit of assessment is for individuals
            roles: null,
            completedAssessments: null,
            checkin: null
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
            for (let index = 0; index < this.state.completedAssessments.length; index++) {
                if (this.state.completedAssessments[index]["team_id"] === teamId) {
                    return this.state.completedAssessments[index];
                }
            }

            return false;
        }

        this.getCompleteIndividual = (userId) => {
            for (let index = 0; index < this.state.completedAssessments.length; index++) {
                if (this.state.completedAssessments[index]["user_id"] === userId) {
                    return this.state.completedAssessments[index];
                }
            }

            return false;
        }

        this.handleDone = () => {
            var navbar = this.props.navbar;

            var chosenAssessmentTask = navbar.state.chosenAssessmentTask;

            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
                "completedAssessments", this
            );
        }

        this.refreshTeams = () => {
            var navbar = this.props.navbar;

            var chosenAssessmentTask = navbar.state.chosenAssessmentTask;

            genericResourceGET(
                `/checkin?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
                 "checkin", this
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.rubrics === null && prevState.teams === null && prevState.users === null) {
            if (this.state.unitOfAssessment && this.state.teams && this.state.teams.length > 0) {
                var teamIds = this.state.teams.map(team => team.team_id);
    
                genericResourceGET(
                    `/user?team_ids=${teamIds}`,
                    "users", this
                );
            }
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCourse = state.chosenCourse;

        var unitOfAssessment = chosenAssessmentTask["unit_of_assessment"];

        const cookies = new Cookies();

        const userId = cookies.get('user')["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this
        );

        genericResourceGET(
            `/role?user_id=${userId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this
        );

        genericResourceGET( 
            `/checkin?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
             "checkin", this
        );

        if (unitOfAssessment) {    // if team assessments, get teams for this course
            genericResourceGET(
                `/team?course_id=${chosenCourse["course_id"]}`,
                "teams", this
            );
            console.log("team");
        } else {                // if individual assessments, get student users for this course
            genericResourceGET(
                `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
                "users", this
            );
        }
 
        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
            "completedAssessments", this
        );

    }

    render() {
        const {
            errorMessage,
            isLoaded,
            rubrics,
            teams,
            unitOfAssessment,
            users,
            completedAssessments
        } = this.state;
        console.log("render - state:", this.state);
        if (errorMessage) {
            return (
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !rubrics || !users || !completedAssessments) {
            console.log(isLoaded, rubrics, users, completedAssessments);
            return (
                <Loading />
            );

        } else {
            console.log("render - else:");
            var navbar = this.props.navbar;

            var chosenCompleteAssessmentTask = navbar.state.chosenCompleteAssessmentTask;

            var json = rubrics["category_rating_observable_characteristics_suggestions_json"];

            json["done"] = null;

            json["comments"] = "";

            var initialUnitData = {};
            if (unitOfAssessment) { 

                Object.keys(users).forEach((teamId) => {
                    var complete = this.getCompleteTeam(teamId - "0");
                    console.log("getCompleteTeam:");
                    if (complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null && 
                                            this.doRubricsForCompletedMatch(json, complete["rating_observable_characteristics_suggestions_data"])) {
                        complete["rating_observable_characteristics_suggestions_data"]["done"] = this.props.userRole ? false : complete["done"];

                        initialUnitData[teamId] = complete["rating_observable_characteristics_suggestions_data"];

                    } else {
                        initialUnitData[teamId] = json;
                    }
                });
            } else {
                if (users === null || users.length === 0) {
                    return (
                        <ErrorMessage
                            fetchedResource={"Student users for this course"}
                            errorMessage={"No users found for this course."}
                        />
                    );
                } else {
                    users.map((user) => {
            
                        var complete = this.getCompleteIndividual(user["user_id"]);
                        console.log("getCompleteIndividual:");
                        if (complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null && 
                                                this.doRubricsForCompletedMatch(json, complete["rating_observable_characteristics_suggestions_data"])) {
                            complete["rating_observable_characteristics_suggestions_data"]["done"] = this.props.userRole ? false : complete["done"];

                            initialUnitData[user["user_id"]] = complete["rating_observable_characteristics_suggestions_data"];

                        } else {
                            initialUnitData[user["user_id"]] = json;
                        }
                    });
                    console.log("initialUnitData:", initialUnitData);
                }
            }
            
            var singleUnitData = {};

            var singleTeam = [];

            var singleUser = [];

            if (chosenCompleteAssessmentTask !== null) {

                var data = chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"];

                if (data && this.doRubricsForCompletedMatch(json, data)) {
                    data["done"] = chosenCompleteAssessmentTask["done"];

                } else {
                    data = json;
                }

                if (unitOfAssessment)  { 
                    var teamId = chosenCompleteAssessmentTask["team_id"];
                    singleUnitData[teamId] = data;
                    teams.map((team) => {
                        if (team["team_id"] === chosenCompleteAssessmentTask["team_id"]) {
                            singleTeam.push(team);
                        }

                        return team;
                    });
                } else {
                    var userId = chosenCompleteAssessmentTask["user_id"];
                    singleUnitData[userId] = data;
                    users.map((user) => {
                        if (user["user_id"] === chosenCompleteAssessmentTask["user_id"]) {
                            singleUser.push(user);
                        }

                        return user;
                    });
                }

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

                        checkin={this.state.checkin}

                        form={{
                            "rubric": rubrics,
                            "units": (unitOfAssessment ? (chosenCompleteAssessmentTask !== null ? singleTeam : teams) : 
                                                         (chosenCompleteAssessmentTask !== null ? singleUser : users)),
                            "users": users,
                            "unitInfo": chosenCompleteAssessmentTask !== null ? singleUnitData : initialUnitData,
                        }}

                        formReference={this}

                        handleDone={this.handleDone}

                        refreshTeams={this.refreshTeams}

                        userRole={this.props.userRole}

                        completedAssessments={completedAssessments}
                    />
                </Box>
            )
        }
    }
}

export default CompleteAssessmentTask;
