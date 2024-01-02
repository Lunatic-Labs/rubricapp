import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam.js'
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility.js';

// NOTE: Using User_routes.py
// Currently a copy of StudentManageCurrentTeam file

// TODO: Fetch all the students and save them into a team
class StudentManageCurrentTeam extends Component {
    constructor(props) {
		// NOTE: super is used to create the state
        super(props);
        this.state = {
            error: null,
			errorMessage: null,
            users: null
        };
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        let course_id = this.props.navbar.state.chosenCourse.course_id;
        genericResourceGET(`/user?course_id=${course_id}`, "users", this);
    }
  render() {
		const {
			error,
			errorMessage,
			users
		} = this.state;
        var navbar = this.props.navbar;
		if (error) {
			return(
				<div className='container'>
					<ErrorMessage
						fetchedResource={"Manage Team"}
						errorMessage={errorMessage} 
					/>	
				</div>
			)
		} else if (!users) {
			return (
				<div className='container'>
					<h1>loading...</h1>
				</div>
			)
		} else {
            return(
                <>
                    <BuildTeamTable 
                        navbar={navbar}
                        users={this.state.users}
                    />
                </>
            )
	    }
    }
}

export default StudentManageCurrentTeam;
