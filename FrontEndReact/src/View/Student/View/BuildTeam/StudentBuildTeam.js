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
            teams: null
        };
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        fetch(API_URL + `/team?course_id=${chosenCourse["course_id"]}`)
        .then(res=> res.json())
        .then((result) => {
            if(result["success"]===false) {
               this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    teams: result['content']['teams'][0]
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
            teams
		} = this.state;
        var navbar = this.props.navbar;
        navbar.studentBuildTeam = {};
        navbar.studentBuildTeam.teams = teams;
		if (error) {
			return(
				<div className='container'>
					<ErrorMessage
						fetchedResource={"Manage Team"}
						errorMessage={errorMessage} 
					/>	
				</div>
			)
		} else if (!isLoaded || !teams) {
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
