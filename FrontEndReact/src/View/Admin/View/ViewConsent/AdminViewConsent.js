import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewConsent from './ViewConsent';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

class AdminViewConsent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            users: []
        }
    }
    componentDidMount() {
        genericResourceGET(`/user?course_id=${this.props.chosenCourse["course_id"]}`, 'users', this);
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            users
        } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Users"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Users"}
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
                    <h1
                        className='mt-5'
                    >
                        View Consent
                    </h1>
                    <ViewConsent
                        navbar={this.props.navbar}
                        users={users}
                        chosenCourse={this.props.chosenCourse}
                    />
                </div>
            )
        }
    }
}

export default AdminViewConsent;