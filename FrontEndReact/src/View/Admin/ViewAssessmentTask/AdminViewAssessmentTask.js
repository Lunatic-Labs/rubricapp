import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            JSON: null,
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/rubric/1")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    JSON: result["content"]["rubrics"][0],
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
        const { error, isLoaded, JSON } = this.state;
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
            if(JSON) {
                return(
                    <React.Fragment>
                        <div className="container">
                            <h1 className="text-center h3 mt-5 fw-bold">{JSON["rubric_name"]}</h1>
                            <p className="text-center h3">{JSON["rubric_desc"]}</p>
                            <Form data={JSON["categories"]}/>
                        </div>
                    </React.Fragment>
                )
            }
        }
    }
}

export default AdminViewAssessmentTask;