import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ManageCurrentTeamTable from './ManageCurrentTeam';	
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
        fetch(API_URL  + `/user?course_id=${this.props.chosenCourse["course_id"]}&role_id=5`)
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
		} else if (!isLoaded) {
			return (
				<div className='container'>
					<h1>loading...</h1>
				</div>
			)
		} else {
        return(
            <>
                <ManageCurrentTeamTable
                    users={this.state.users} 
                    course_id={this.props.chosenCourse["course_id"]}
                    setNewTab={this.props.setNewTab}
                />
            </>
        )
	}
  }
}

export default StudentManageCurrentTeam;
