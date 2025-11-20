// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams.js';
import ErrorMessage from '../../Error/ErrorMessage.js';
import { genericResourceGET, parseUserNames } from '../../../utility.js';
import Loading from '../../Loading/Loading.js';



class StudentViewTeams extends Component {
    props: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null
        }
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenCourse = state.chosenCourse;
        const chosenCourseId = chosenCourse["course_id"];
        const adhocMode = !chosenCourse.use_fixed_teams;

        genericResourceGET(
            `/team_by_user?course_id=${chosenCourseId}&adhoc_mode=${adhocMode}`, "teams", this
        ).then(data =>{
            let newTeams: any = [];
            data.teams.forEach((team: any) => {
                newTeams.push(team.team_id);
            });
            this.props.updateUserTeamsIds(newTeams);
        }).catch(error => {
            console.error("Error fetching/parsing teams data:", error);
        }); //This requires future adjusting

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
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )

        } else if (!isLoaded || !teams || !users) {
            return(
                <Loading />
            )

        } else {
            return(
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ViewTeams
                        navbar={this.props.navbar}
                        teams={teams}
                        users={users ? parseUserNames(users) : []}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )
        }
    }
}

export default StudentViewTeams;
