import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import { CircularProgress } from '@mui/material';



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
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(
            `/team_members?course_id=${courseId}`,
            "team_members", this
        );
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
                    <CircularProgress />
                </div>
            )

        } else {
            return (
                <ConfirmCurrentTeamTable
                    currentTeam={currentTeam}
                    students={team_members["users"]}
                    teamId={team_members["team_id"]}
                    navbar={this.props.navbar}
                />
            )
        }
    }
}

export default StudentConfirmCurrentTeam;
