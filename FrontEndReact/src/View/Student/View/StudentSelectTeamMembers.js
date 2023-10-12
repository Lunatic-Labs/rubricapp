import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import SelectTeamMembers from './SelectTeamMembers';
import { API_URL } from '../../../App';


// TODO: Fetch all the students and save them into a team
class StudentSelectTeamMembers extends Component {
    constructor(props) {
		// NOTE: super is used to create the state
        super(props);
        this.state = {
            isLoaded: null,
            students: null,
			// NOTE: Might not need teams
			users: []
        };
    }
	// NOTE: Might need to check if the student is already in a team
    componentDidMount() {
		// NOTE: Using User_routes.py
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
        }},
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        })
    }
    render() {
        return(
            <>
                <SelectTeamMembers
					users={this.state.users} 
					course_id={this.props.chosenCourse["course_id"]}
				/>
            </>
        )
    }
}

export default StudentSelectTeamMembers;
