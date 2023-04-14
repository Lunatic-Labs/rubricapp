import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";

class AssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            JSON: [],
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5500/BackEndFlask/core/json/critical_thinking.json")
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);
                this.setState({
                    isLoaded: true,
                    JSON: result,
                })
            }
        )
        // fetch("http://127.0.0.1:5000/api/rubric/1")
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //         this.setState({
        //             isLoaded: true,
        //             JSON: result["content"],
        //         })
        //     },
        //     (error) => {
        //         this.setState({
        //             isLoaded: true,
        //             error: error
        //         })
        //     }
        // )
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
                    {/* renders the whole card. May need to be changed.  */}
                    <div className="container">  
                    <Form data={JSON}/>
                    </div>
                </React.Fragment>
            )
        }
    }
}

export default AssessmentTask;