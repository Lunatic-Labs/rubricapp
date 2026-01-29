import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam'
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

interface StudentManageCurrentTeamProps {
    navbar: any;
}

interface StudentManageCurrentTeamState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    users: any[] | null;
}

class StudentManageCurrentTeam extends Component<StudentManageCurrentTeamProps, StudentManageCurrentTeamState> {
    constructor(props: StudentManageCurrentTeamProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            users: null
        };
    }

    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(
            `/user?course_id=${courseId}`, 
            "users", this as any);
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage} 
                    />
                </div>
            )

        } else if (!isLoaded || !users) {
            return (
                <Loading />
            )

        } else {
            return(
                <BuildTeamTable 
                    navbar={navbar}
                    users={this.state.users || []}
                />
            )
        }
    }
}

export default StudentManageCurrentTeam;
