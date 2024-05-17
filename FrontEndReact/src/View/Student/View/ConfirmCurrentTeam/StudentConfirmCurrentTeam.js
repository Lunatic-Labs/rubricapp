import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';



class StudentConfirmCurrentTeam extends Component {
    constructor(props) {
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
            "teamMembers", this
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
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team"}
                        errorMessage={errorMessage}
                    />
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
