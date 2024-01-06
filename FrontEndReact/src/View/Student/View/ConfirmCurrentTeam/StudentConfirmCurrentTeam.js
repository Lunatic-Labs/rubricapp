import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

// NOTE: Using Team_routes.py

// TODO: Fetch students team and display all students in the team
class StudentConfirmCurrentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            currentTeam: null,
            team_members: null
        };
    }

    componentDidMount() {
        var course_id = this.props.navbar.state.chosenCourse.course_id;

        genericResourceGET(`/team_members?course_id=${course_id}`, "team_members", this);
    }

    render() {
        const {
            errorMessage,
            currentTeam,
            team_members
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
        } else if (!team_members) {
            return (
                <div className='container'>
                    <h1> Loading... </h1>
                </div>
            )
        } else {
            return (
                <ConfirmCurrentTeamTable
                    currentTeam={currentTeam}
                    students={team_members["users"]}
                    team_id={team_members["team_id"]}
                    navbar={this.props.navbar}
                />
            )
        }
    }
}

export default StudentConfirmCurrentTeam;