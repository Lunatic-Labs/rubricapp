import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";
import { API_URL } from '../../../../App';
import { Box } from '@mui/material';

class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            teamInfo: null
        }

        this.getAllUsersForAllTeams = (fetchedTeams) => {
            var team_ids = [];

            for(var index = 0; index < fetchedTeams.length; index++) {
                team_ids = [...team_ids, fetchedTeams[index]["team_id"]];
            }

            fetch(API_URL + `/user?team_ids=${team_ids}`)
            .then(res => res.json())
            .then((result) => {
                if(result["success"]) {
                    this.setState({
                        isLoaded: true,
                        teams: fetchedTeams,
                        teamInfo: result["content"]["users"][0]
                    });
                } else {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    });
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                });
            });
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var chosenCourse = state.chosenCourse;

        fetch(
            API_URL + `/rubric/${chosen_assessment_task === null && chosen_complete_assessment_task === null ? 1 : chosen_assessment_task["rubric_id"]}`
        )
        .then(res => res.json())
        .then((result) => {
            if(result["success"]) {
                this.setState({
                    areRubricsLoaded: true,
                    rubrics: result["content"]["rubrics"][0]
                });
            }
        })
        .catch(error => {
            this.setState({
                isLoaded: true,
                error: error
            });
        })

        fetch(
            API_URL + `/team?course_id=${chosenCourse["course_id"]}`
        )
        .then(res => res.json())
        .then((result) => {
            if(result["success"]) {
                this.getAllUsersForAllTeams(result["content"]["teams"][0]);
            }
        })
        .catch(error => {
            this.setState({
                isLoaded: true,
                error: error
            });
        })
    }

    render() {
        const {
            error,
            isLoaded,
            rubrics,
            teams,
            teamInfo
        } = this.state;
        var navbar = this.props.navbar;
        navbar.completeAssessmentTask = {};
        navbar.completeAssessmentTask.rubrics = rubrics;
        navbar.completeAssessmentTask.teams = teams;
        navbar.completeAssessmentTask.teamInfo = teamInfo;

        if(error) {
            return(
                <React.Fragment>
                    <h1>Fetching data resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
        } else if (!isLoaded || !rubrics || !teams || !teamInfo) {
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
                        />
                    </Box>
                </React.Fragment>
            )
        }
    }
}

export default CompleteAssessmentTask;