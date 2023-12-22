import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ManageCurrentTeamTable from './ManageCurrentTeam';	
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

// NOTE: Using User_routes.py

// TODO: Fetch all the students and save them into a team
class StudentManageCurrentTeam extends Component {
    constructor(props) {
	// NOTE: super is used to create the state
        super(props);
        this.state = {
            error: null,
    	    errorMessage: null,
            isLoaded: false,
            users: null,
	    users: []
        };
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        genericResourceGET(`/user?course_id=${chosenCourse["course_id"]}&role_id=5`, "user", this);
    }
  render() {
		const {
			error,
			errorMessage,
			isLoaded,
            users
		} = this.state;
		if (error) {
			return(
				<div className='container'>
					<ErrorMessage
						fetchedResource={"Manage Team"}
						errorMessage={errorMessage} 
					/>	
				</div>
			)
		} else if (!isLoaded || !users) {
			return (
				<div className='container'>
					<h1>loading...</h1>
				</div>
			)
		} else {
            var navbar = this.props.navbar;
            navbar.studentManageCurrentTeam = {};
            navbar.studentManageCurrentTeam.users = users;
            return(
                <>
                    <ManageCurrentTeamTable
                        navbar={navbar}
                    />
                </>
            )
	    }
    }
}

export default StudentManageCurrentTeam;
