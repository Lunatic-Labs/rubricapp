import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamsTA from './ViewTeamsTA';
import ErrorMessage from '../../Error/ErrorMessage';
import { genericResourceGET } from '../../../utility';
import Loading from '../../Loading/Loading';
import Cookies from 'universal-cookie';

/**
 * @description
 * TA-facing (or observer-facing) view of teams.
 *
 * Responsibilities:
 *  - Reads the current TA's user_id from cookies.
 *  - Fetches team membership data for the current course.
 *  - Filters the returned data down to teams where observer_id matches this TA.
 *  - Passes a simplified teams[] array to <ViewTeamsTA />.
 *
 * Props:
 *  @prop {Object} navbar - Navbar instance with state.chosenCourse.
 *
 * State:
 *  @property {string|null} errorMessage - Error message from the fetch, if any.
 *  @property {boolean}     isLoaded     - True once team_members has been loaded.
 *  @property {Array|null}  team_members - Raw response from /team_members (array of teams).
 *  @property {number|null} user_id      - Current TA's user_id (from cookie).
 */

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

    /**
     * @method componentDidMount
     * @description
     * On mount, obtains the TA's user_id and loads team membership data.
     *
     * Steps:
     *  1. Reads user_id from the "user" cookie and stores it in state.user_id.
     *
     *  2. Fetch:
     *     - GET /team_members?course_id={course_id}&observer_id=user_id
     *       - course_id : navbar.state.chosenCourse.course_id
     *       - observer_id: currently passed as the literal string "user_id" in the query.
     *         (Likely intended to be the numeric user_id → JIRA candidate: fix query param.)
     *       - genericResourceGET stores the response array in state.team_members.
     *
     * Data shape (per comment):
     *  - Each element in team_members has keys:
     *      * users       : array of team members
     *      * team_id     : numeric ID
     *      * team_name   : string
     *      * observer_id : ID of TA/observer responsible for this team
     *
     * Sorting:
     *  - This component does not sort team_members; it iterates in the order returned
     *    by the backend and builds a teams[] array for <ViewTeamsTA />.
     *
     * Possible JIRA notes:
     *  - /team_members may be returning all teams for the course, with filtering done
     *    on the front end via observer_id === this.state.user_id. If so, that is more
     *    data than needed and could be narrowed server-side.
     *  - If other TA views also call /team_members for the same course/user, those
     *    calls could be consolidated.
     */
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
