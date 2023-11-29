import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam.js'
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';

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
            isLoaded: false,
            students: null,
		    users: []
        };
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        fetch(API_URL  + `/user?course_id=${chosenCourse["course_id"]}&role_id=5`)
        .then(res => res.json())
        .then((result) => {
            if(result["success"]===false) {
               this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    users: result['content']['users'][0]
                })
            }
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }
  render() {
		const {
			error,
			errorMessage,
			isLoaded,
            users
		} = this.state;
        var navbar = this.props.navbar;
        navbar.studentBuildTeam = {};
        navbar.studentBuildTeam.users = users;
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
            return(
                <>
                    <BuildTeamTable
                        navbar={navbar}
                    />
                </>
            )
	    }
    }
}

export default StudentManageCurrentTeam;
