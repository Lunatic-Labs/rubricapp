import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";
import { genericResourceGET } from '../../../../utility';

class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rubrics: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        genericResourceGET(`/rubric?rubric_id=${chosen_assessment_task["rubric_id"]}`, 'rubrics', this);
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
                    <div className="container">
                        <h1 className="text-center h3 mt-5 fw-bold">{rubrics["rubric_name"]}</h1>
                        <p className="text-center h3">{rubrics["rubric_desc"]}</p>
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
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default CompleteAssessmentTask;
