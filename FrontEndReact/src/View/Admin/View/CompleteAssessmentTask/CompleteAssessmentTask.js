import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";
import { genericResourceGET } from '../../../../utility';
import { Box } from '@mui/material';

class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            users: null
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
    }

    render() {
        const {
            error,
            isLoaded,
            rubrics,
            teams,
            users
        } = this.state;

        if(error) {
            return( <h1>Fetching data resulted in an error: { error.message }</h1> );

        } else if (!isLoaded || !rubrics || !teams || !users) {
            return( <h1>Loading...</h1> );
        } else {
            var initialTeamData = {};
            var json = rubrics["category_rating_observable_characteristics_suggestions_json"];

            json["comments"] = "";

            Object.keys(users).forEach((team_id) => {
                initialTeamData[team_id] = json;
            });

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
                            form={{ "rubric": rubrics, "teams": teams, "users": users, "teamInfo": initialTeamData }}
                            formReference={this}
                        />
                    </Box>
                </>
            )
        }
    }
}

export default CompleteAssessmentTask;