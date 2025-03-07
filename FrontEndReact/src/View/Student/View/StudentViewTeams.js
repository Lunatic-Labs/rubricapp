import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams.js';
import ErrorMessage from '../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../utility.js';
import Loading from '../../Loading/Loading.js';



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
        var chosenCourseId = chosenCourse["course_id"];

        genericResourceGET(
            `/team_by_user?course_id=${chosenCourseId}&adhoc_mode=${false}`, "teams", this); //This requires future adjusting

        var url = (
            chosenCourse["use_tas"] ?
            `/user?course_id=${chosenCourseId}&role_id=4` :
            `/user?uid=${chosenCourse["admin_id"]}`
        );

        genericResourceGET(url, "users", this);
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;

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
                <Loading />
            )

        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={this.props.navbar}
                        teams={teams}
                        users={users ? parseUserNames(users) : []}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;
