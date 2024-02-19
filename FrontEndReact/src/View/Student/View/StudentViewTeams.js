import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams.js';
import ErrorMessage from '../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../utility.js';



class StudentViewTeams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(`/team?course_id=${chosenCourse["course_id"]}`, "teams", this);
        genericResourceGET(`/user?course_id=${chosenCourse["course_id"]}&role_id=4`, "users", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;

        var navbar = this.props.navbar;

        navbar.adminViewTeams = {};
        navbar.adminViewTeams.teams = teams;
        navbar.adminViewTeams.users = users ? parseUserNames(users) : [];

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !teams || !users) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )

        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={navbar}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;