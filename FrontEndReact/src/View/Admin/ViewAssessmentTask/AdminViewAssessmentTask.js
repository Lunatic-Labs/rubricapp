import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rubrics: null,
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/rubric/2")
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
        const { error, rubrics } = this.state;
        var isLoaded = true;
        if(error) {
            return(
                <React.Fragment>
                    <h1>Fetching data resulted in an error: { error.message }</h1>
                </React.Fragment>
            )
        } else if (!isLoaded) {
            return(
                <React.Fragment>
                    <h1>Loading...</h1>
                </React.Fragment>
            )
        } else {
            if(rubrics) {
                return(
                    <React.Fragment>
                        <div className="container">
                            <h1 className="text-center h3 mt-5 fw-bold">{rubrics["rubric_name"]}</h1>
                            <p className="text-center h3">{rubrics["rubric_description"]}</p>
                            <Form data={rubrics["categories"]}/>
                        </div>
                    </React.Fragment>
                )
            }
        }
    }
}

export default AdminViewAssessmentTask;