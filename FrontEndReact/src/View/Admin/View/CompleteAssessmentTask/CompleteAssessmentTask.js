import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';



class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            users: null,
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

        this.getComplete = (teamId) => {
            for (let index = 0; index < this.state.completedAssessments.length; index++) {
                if (this.state.completedAssessments[index]["team_id"] === teamId) {
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

    componentDidUpdate() {
        if (this.state.rubrics && this.state.teams && this.state.users === null) {
            var teamIds = [];

            for (var index = 0; index < this.state.teams.length; index++) {
                teamIds = [...teamIds, this.state.teams[index]["team_id"]];
            }

            genericResourceGET(
                `/user?team_ids=${teamIds}`,
                "users", this
            );
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCourse = state.chosenCourse;

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

        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        );

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
            users,
            completedAssessments
        } = this.state;

        if (errorMessage) {
            return (
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !rubrics || !teams || !users || !completedAssessments) {
            return (
                <h1>Loading...</h1>
            );

        } else {
            var navbar = this.props.navbar;

            var chosenCompleteAssessmentTask = navbar.state.chosenCompleteAssessmentTask;

            var json = rubrics["category_rating_observable_characteristics_suggestions_json"];

            json["done"] = null;

            json["comments"] = "";

            var initialTeamData = {};

            Object.keys(users).forEach((teamId) => {
                var complete = this.getComplete(teamId - "0");

                if (complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null && this.doRubricsForCompletedMatch(json, complete["rating_observable_characteristics_suggestions_data"])) {
                    complete["rating_observable_characteristics_suggestions_data"]["done"] = this.props.userRole ? false : complete["done"];

                    initialTeamData[teamId] = complete["rating_observable_characteristics_suggestions_data"];

                } else {
                    initialTeamData[teamId] = json;
                }
            });

            var singleTeamData = {};

            var singleTeam = [];

            if (chosenCompleteAssessmentTask !== null) {
                var teamId = chosenCompleteAssessmentTask["team_id"];

                var data = chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"];

                if (data && this.doRubricsForCompletedMatch(json, data)) {
                    data["done"] = chosenCompleteAssessmentTask["done"];

                } else {
                    data = json;
                }

                singleTeamData[teamId] = data;

                teams.map((team) => {
                    if (team["team_id"] === chosenCompleteAssessmentTask["team_id"]) {
                        singleTeam.push(team);
                    }

                    return team;
                });
            }

            return (
                <Box>
                    <Box className="assessment-title-spacing">
                        <Box className='d-flex flex-column justify-content-start'>
                            <h4>{rubrics["rubric_name"]}</h4>

                            <p>{rubrics["rubric_description"]}</p>
                        </Box>
                    </Box>

                    <Form
                        navbar={this.props.navbar}

                        role_name={this.state.roles["role_name"]}

                        checkin={this.state.checkin}

                        form={{
                            "rubric": rubrics,
                            "teams": (chosenCompleteAssessmentTask !== null ? singleTeam : teams),
                            "users": users,
                            "teamInfo": (chosenCompleteAssessmentTask !== null ? singleTeamData : initialTeamData)
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
