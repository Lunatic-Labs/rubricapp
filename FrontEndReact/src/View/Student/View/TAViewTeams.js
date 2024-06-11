import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamsTA from './ViewTeamsTA.js';
import ErrorMessage from '../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../utility.js';
import Loading from '../../Loading/Loading.js';
import Cookies from 'universal-cookie';



class TAViewTeams extends Component {
    constructor(props) {
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
        genericResourceGET(`/team_members?course_id=${chosenCourse["course_id"]}&observer_id=user_id`, "team_members", this);

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
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !team_members) {
            return(
                <Loading />
            )

        } else {
            var studentNames = {}
            var teams=[]
            for (var ci = 0; ci < team_members.length; ci++) {
                if (team_members[ci]["observer_id"] === this.state.user_id) {
                    var team={};
                    var names = "";  
                    for (var i = 0; i < team_members[ci]["users"].length; i++) {
                        names = team_members[ci]["users"] + ", ";
                    }
                    var str_len = names.length;
                    team["studentNames"]= names.substring(0, str_len-2);
                    team["teamName"] = team_members[ci]["team_name"];
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