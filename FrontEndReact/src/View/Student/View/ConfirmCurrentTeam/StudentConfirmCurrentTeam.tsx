// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';



class StudentConfirmCurrentTeam extends Component {
    props: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            teamMembers: null,
        };
    }

    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(
            `/team_members?course_id=${courseId}`,
            "team_members", this, {dest: "teamMembers"}
        );
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            teamMembers
        } = this.state;

        if (errorMessage) {
            return (
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team"}
                        errorMessage={errorMessage}
                    />
                // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
                </div>
            )

        } else if (!isLoaded || !teamMembers) {
            return (
                <Loading />
            )

        } else {
            return (
                <ConfirmCurrentTeamTable
                    students={teamMembers["users"]}
                    teamId={teamMembers["team_id"]}
                    teamName={teamMembers["team_name"]}
                    navbar={this.props.navbar}
                />
            )
        }
    }
}

export default StudentConfirmCurrentTeam;
