import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';



class StudentConfirmCurrentTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            currentTeam: null,
            teamMembers: null
        };
    }

    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(`/team?course_id=${courseId}`, "teamMembers", this);
    }

    render() {
        console.log(this.state.teamMembers)
        const {
            errorMessage,
            currentTeam,
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

        } else if (!teamMembers) {
            return (
                <div className='container'>
                    <h1> Loading... </h1>
                </div>
            )

        } else {
            return (
                <ConfirmCurrentTeamTable
                    currentTeam={currentTeam}
                    students={teamMembers["users"]}
                    teamId={teamMembers["team_id"]}
                    navbar={this.props.navbar}
                />
            )
        }
    }
}

export default StudentConfirmCurrentTeam;
