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
            courses: null
        }
    }

    componentDidMount() {
        genericResourceGET(`/course?admin_id=${this.props.navbar.state.chosenCourse["admin_id"]}`, "courses", this);
    }

    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            courses
        } = this.state;

        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Courses"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Courses"}
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
                    <ViewAssessmentStatus
                        courses={courses}
                    />
                </div>
            )
        }
    }
}

export default AdminViewAssessmentStatus;