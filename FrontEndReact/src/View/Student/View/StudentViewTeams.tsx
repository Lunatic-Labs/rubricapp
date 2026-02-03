import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import ErrorMessage from '../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames } from '../../../utility';
import Loading from '../../Loading/Loading';



interface StudentViewTeamsProps {
    navbar: any;
    updateUserTeamsIds: (teamIds: any[]) => void;
}

interface StudentViewTeamsState {
    errorMessage: string | null;
    isLoaded: boolean;
    teams: any;
    users: any;
}

class StudentViewTeams extends Component<StudentViewTeamsProps, StudentViewTeamsState> {
    constructor(props: StudentViewTeamsProps) {
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
                <div className='container'>
                    <ErrorMessage
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
                        users={users ? parseUserNames(users) : {}}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;
