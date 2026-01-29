import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

interface StudentConfirmCurrentTeamProps {
    navbar: any;
    students?: any;
    chosenCourse?: any;
}

interface StudentConfirmCurrentTeamState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    teamMembers: any | null;
}

class StudentConfirmCurrentTeam extends Component<StudentConfirmCurrentTeamProps, StudentConfirmCurrentTeamState> {
    constructor(props: StudentConfirmCurrentTeamProps) {
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
            "team_members", this as any, {dest: "teamMembers"}
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
