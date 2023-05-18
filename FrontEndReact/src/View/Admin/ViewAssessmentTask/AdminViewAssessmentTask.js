import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";

class AdminViewAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            JSON: [],
        }
    }
    componentDidMount() {
        // fetch("http://127.0.0.1:5000/BackEndFlask/json/critical_thinking.json", 
        // {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }
        //     })
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //         this.setState({
        //             isLoaded: true,
        //             JSON: result,
        //         })
        //     }
        // )
        fetch("http://127.0.0.1:5000/api/rubric/1")
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    JSON: result["content"],
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
            return(
                <React.Fragment>
                    <div className="container">
                        <h1 className="text-center h3 mt-5 fw-bold">{JSON["name"]}</h1>
                        <p className="text-center h3">{JSON["description"]}</p>
                        <Form data={JSON}/>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default AdminViewAssessmentTask;