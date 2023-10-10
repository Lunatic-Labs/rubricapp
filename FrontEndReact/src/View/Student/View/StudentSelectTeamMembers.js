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
        fetch(API_URL  + `/student?role_id=${this.props.chosenCourse["course_id"]}`)
		.then(res => res.json())
		.then((result)) => {
				if(result)
		}
    }
    render() {
        return(
            <>
                <SelectTeamMembers/>
            </>
        )
    }
}

export default StudentSelectTeamMembers;
