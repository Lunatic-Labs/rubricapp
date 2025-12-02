import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamsTA from './ViewTeamsTA';
import ErrorMessage from '../../Error/ErrorMessage';
import { genericResourceGET } from '../../../utility';
import Loading from '../../Loading/Loading';
import Cookies from 'universal-cookie';



interface TAViewTeamsProps {
    navbar: any;
}

interface TAViewTeamsState {
    errorMessage: any;
    isLoaded: boolean;
    teams: any;
    users: any;
    user_id: any;
    team_members?: any;
}

class TAViewTeams extends Component<TAViewTeamsProps, TAViewTeamsState> {
    constructor(props: TAViewTeamsProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null,
            user_id: null
        }

    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var cookies = new Cookies();
        var user_id = cookies.get("user")["user_id"];
        this.setState({user_id: user_id})

        // team_members returns a dictionary with keys users, team_id, team_name, observer_id.
        // users is an array with a list of team members
        genericResourceGET(
            `/team_members?course_id=${chosenCourse["course_id"]}&observer_id=user_id`, 
            "team_members", this);

    }

    render() {
        const {
            errorMessage,
            isLoaded,
            team_members,
        } = this.state;
        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !team_members) {
            return(
                <Loading />
            )

        } else {
            var studentNames = {};
            type Team = {
                studentNames: string;
                teamName: string;
            };
            var teams: Team[] = [];
            for (var ci = 0; ci < team_members.length; ci++) {
                if (team_members[ci]["observer_id"] === this.state.user_id) {
                    let names = "";  
                    for (var i = 0; i < team_members[ci]["users"].length; i++) {
                        names += team_members[ci]["users"][i] + ", ";
                    }
                    var str_len = names.length;
                    const team: Team = {
                        studentNames: names.substring(0, str_len-2),
                        teamName: team_members[ci]["team_name"]
                    };
                    teams.push(team);
                }
            }
            return(
                <div className='container'>
                    <ViewTeamsTA
                        navbar={this.props.navbar}
                        teams={teams}
                        users={studentNames ? studentNames : []}
                    />
                </div>
            )
        }
    }
}

export default TAViewTeams;