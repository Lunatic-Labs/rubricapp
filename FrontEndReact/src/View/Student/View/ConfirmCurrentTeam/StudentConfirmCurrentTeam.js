import {
    Component
} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam';
import {
    API_URL
} from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

// NOTE: Using Team_routes.py

// TODO: Fetch students team and display all students in the team
class StudentConfirmCurrentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            currentTeam: null,
            team_members: null,
            teams: null
        };            
            
        }
    

    componentDidMount() {
        console.log(this.props.navbar.state.chosenCourse.course_id)
        let course_id = this.props.navbar.state.chosenCourse.course_id;
        genericResourceGET(`/team_members?course_id=${course_id}`, "team_members", this);
    }

    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            currentTeam,
            team_members
        } = this.state;
        if (error) {
            return (<div className='container' >
                <ErrorMessage fetchedResource={
                    "Team"
                }
                    errorMessage={
                        errorMessage
                    } />
            </div>
            )
        } else if (!isLoaded) {
            return (<div className='container' >
                <h1> Loading... </h1> </div>
            )
        } else {
            return (
            <ConfirmCurrentTeamTable currentTeam={
                    currentTeam
                }
                students={
                    team_members
                }/>
            )
        }
    }
}

export default StudentConfirmCurrentTeam;
