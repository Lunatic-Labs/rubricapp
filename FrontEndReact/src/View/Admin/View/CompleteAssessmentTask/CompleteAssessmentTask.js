import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';

class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            users: null,
            completed_assessments: null
        }

        this.getComplete = (team_id) => {
            for(let index = 0; index < this.state.completed_assessments.length; index++) {
                if(this.state.completed_assessments[index]["team_id"] === team_id) {
                    return this.state.completed_assessments[index];
                }
            }
            return false;
        }

        this.handleDone = () => {
            var navbar = this.props.navbar;
            var chosen_assessment_task = navbar.state.chosen_assessment_task;

            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosen_assessment_task["assessment_task_id"]}`,
                "completed_assessments", this
            );
        }
    }

    componentDidUpdate() {
        if(this.state.rubrics && this.state.teams && this.state.users === null) {
            var team_ids = [];

            for(var index = 0; index < this.state.teams.length; index++) {
                team_ids = [...team_ids, this.state.teams[index]["team_id"]];
            }

            genericResourceGET(
                `/user?team_ids=${team_ids}`,
                "users", this
            );
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(
            `/rubric?rubric_id=${chosen_assessment_task["rubric_id"]}`,
            "rubrics", this
        );

        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        );

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosen_assessment_task["assessment_task_id"]}`,
            "completed_assessments", this
        )
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            rubrics,
            teams,
            users,
            completed_assessments
        } = this.state;

        if(errorMessage) {
            return(
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );
        } else if (!isLoaded || !rubrics || !teams || !users || !completed_assessments) {
            return(
                <h1>Loading...</h1>
            );
        } else {
            var navbar = this.props.navbar;
            var chosen_complete_assessment_task = navbar.state.chosen_complete_assessment_task;

            var json = rubrics["category_rating_observable_characteristics_suggestions_json"];

            json["done"] = null;
            json["comments"] = "";

            var initialTeamData = {};

            Object.keys(users).forEach((team_id) => {
                var complete = this.getComplete(team_id-"0");

                if(complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null) {
                    complete["rating_observable_characteristics_suggestions_data"]["done"] = complete["done"];
                    initialTeamData[team_id] = complete["rating_observable_characteristics_suggestions_data"];
                } else {
                    initialTeamData[team_id] = json;
                }
            });

            var singleTeamData = {};
            var singleTeam = [];

            if(chosen_complete_assessment_task !== null) {
                var team_id = chosen_complete_assessment_task["team_id"];
                var data = chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"];

                if(data) {
                    data["done"] = chosen_complete_assessment_task["done"];
                } else {
                    data = json;
                }

                singleTeamData[team_id] = data;

                teams.map((team) => {
                    if(team["team_id"] === chosen_complete_assessment_task["team_id"]) {
                        singleTeam.push(team);
                    }

                    return team;
                });
            }

            return(
                <>
                    {/* {window.addEventListener("beforeunload", (event) => {
                        event.preventDefault();
                        return event.returnValue = 'Are you sure you want to close? Current Data will be lost!';
                    })} */}

                    <Box>
                        <Box className="assessment-title-spacing">
                            <h4>{rubrics["rubric_name"]}</h4>
                            <p>{rubrics["rubric_desc"]}</p>
                        </Box>

                        <Form
                            navbar={this.props.navbar}
                            form={{
                                "rubric": rubrics,
                                "teams": (chosen_complete_assessment_task !== null ? singleTeam : teams),
                                "users": users,
                                "teamInfo": (chosen_complete_assessment_task !== null ? singleTeamData : initialTeamData)
                            }}
                            formReference={this}
                            handleDone={this.handleDone}
                        />
                    </Box>
                </>
            )
        }
    }
}

export default CompleteAssessmentTask;
