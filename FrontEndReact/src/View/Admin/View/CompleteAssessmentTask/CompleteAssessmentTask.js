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

            for(var index = 0; index < this.state.users.length; index++) {
                team_ids = [...team_ids, this.state.users[index]["team_id"]];
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
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(
            `/rubric?rubric_id=${
                chosen_assessment_task === null && chosen_complete_assessment_task === null ?
                1 :
                chosen_assessment_task["rubric_id"]
            }`,
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

        var navbar = this.props.navbar;

        navbar.completeAssessmentTask = {};
        navbar.completeAssessmentTask.rubrics = rubrics;
        navbar.completeAssessmentTask.teams = teams;
        navbar.completeAssessmentTask.teamInfo = users;

        if(error) {
            return(
                <React.Fragment>
                    <h1>Fetching data resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
        } else if (!isLoaded || !rubrics || !teams || !users) {
            return(
                <React.Fragment>
                    <h1>Loading...</h1>
                </React.Fragment>
            )
        } else {
            return(
                <React.Fragment>
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
                            navbar={navbar}
                            chosen_complete_assessment_task={navbar.state.chosen_complete_assessment_task}
                            show_ratings={navbar.state.chosen_assessment_task ? navbar.state.chosen_assessment_task["show_ratings"] : true}
                            show_suggestions={navbar.state.chosen_assessment_task ? navbar.state.chosen_assessment_task["show_suggestions"] : true}
                            readOnly={navbar.state.readOnly}
                            total_observable_characteristics={rubrics["total_observable_characteristics"]}
                            total_suggestions={rubrics["total_suggestions"]}
                            category_rating_observable_characteristics_suggestions_json={rubrics["category_rating_observable_characteristics_suggestions_json"]}
                            data={rubrics["categories"]}
                            category_json={rubrics["category_json"]}
                        />
                    </Box>
                </React.Fragment>
            )
        }
    }
}

export default CompleteAssessmentTask;