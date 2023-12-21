import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import ErrorMessage from '../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames } from '../../../utility';

class StudentViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
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
            error,
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;

        var navbar = this.props.navbar;

        navbar.adminViewTeams = {};
        navbar.adminViewTeams.teams = teams;
        navbar.adminViewTeams.users = parseUserNames(users);

        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
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