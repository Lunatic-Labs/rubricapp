import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import ViewConsent from './ViewConsent';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

interface AdminViewConsentState {
    errorMessage: any;
    isLoaded: boolean;
    users: any;
}

class AdminViewConsent extends Component<any, AdminViewConsentState> {
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            users: null
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        genericResourceGET(`/user?course_id=${chosenCourse["course_id"]}`, 'users', this);
    }
    render() {
        const {
            errorMessage,
            isLoaded,
            users
        } = this.state;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !users) {
            return(
                <Loading />
            )

        } else {
            var navbar = this.props.navbar;
            navbar.viewConsent = {};
            navbar.viewConsent.users = users;
            return(
                <div className='container'>
                    <h1
                        className='mt-5'
                    >
                        View Consent
                    </h1>
                    {/* <ViewConsent
                        navbar={navbar}
                    /> */}
                    <p>ViewConsent component is not implemented yet.</p>
                </div>
            )
        }
    }
}

export default AdminViewConsent;