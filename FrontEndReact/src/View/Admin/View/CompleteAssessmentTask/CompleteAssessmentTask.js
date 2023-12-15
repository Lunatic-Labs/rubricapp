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
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        fetch(API_URL + `/rubric/${chosen_assessment_task===null && chosen_complete_assessment_task===null ? 1 : chosen_assessment_task["rubric_id"]}`)
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    rubrics: result["content"]["rubrics"][0],
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
    }
    render() {
        const {
            error,
            isLoaded,
            rubrics
        } = this.state;
        var navbar = this.props.navbar;
        navbar.completeAssessmentTask = {};
        navbar.completeAssessmentTask.rubrics = rubrics;
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
                        <Box className="content-spacing">
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