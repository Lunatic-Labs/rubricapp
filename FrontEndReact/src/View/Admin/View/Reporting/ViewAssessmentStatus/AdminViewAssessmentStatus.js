import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import ViewAssessmentStatus from './ViewAssessmentStatus';
import { genericResourceGET } from '../../../../../utility';

class AdminViewAssessmentStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            completed_assessments: null
        }
    }

    componentDidMount() {
        genericResourceGET(`/completed_assessment?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "completed_assessments", this);
    }

    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            completed_assessments
        } = this.state;

        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Completed Assessments"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    {/* {console.log("Flap", completed_assessments)} */}
                    {/* {console.log("Flap 5", this.props.navbar.state)} */}
                    <ViewAssessmentStatus
                        completed_assessments={completed_assessments}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;