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
            users: [],
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var chosenCourse = state.chosenCourse;

        const rubricPromise = fetch(API_URL + `/rubric/${chosen_assessment_task === null && chosen_complete_assessment_task === null ? 1 : chosen_assessment_task["rubric_id"]}`)
        .then(res => res.json());

        const teamPromise = fetch(API_URL + `/team?course_id=${chosenCourse["course_id"]}`)
        .then(res => res.json());
        
        Promise.all([rubricPromise, teamPromise])
        .then(([rubricResult, teamResult]) => {
            const rubricData = rubricResult["content"]["rubrics"][0];
            const teamData = teamResult['content']['teams'][0]
            if (teamResult["success"] === false) {
            this.setState({
                isLoaded: true,
                errorMessage: teamResult["message"]
            });
            } else {
            this.setState({
                isLoaded: true,
                rubrics: rubricData,
                teams: teamData
            });
            }
        })
        .catch(error => {
            this.setState({
            isLoaded: true,
            error: error
            });
        })   
        
        var teamInfo = {};
       
        console.log(this.state.teams);
        // for (let i = 0; i < teams.length; i++){

        // }

        var teamId = 2;

        fetch(API_URL + `/user?team_id=${teamId}`)
        .then(res => res.json())
        .then((result) => {
            console.log(result["content"]["users"][0])
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    users: result["content"]["users"][0],
                })
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }

    render() {
        const {
            error,
            isLoaded,
            rubrics,
            teams
        } = this.state;
        var navbar = this.props.navbar;
        navbar.completeAssessmentTask = {};
        navbar.completeAssessmentTask.rubrics = rubrics;
        navbar.completeAssessmentTask.teams = teams;

        if(error) {
            return(
                <React.Fragment>
                    <h1>Fetching data resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
        } else if (!isLoaded || !rubrics) {
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