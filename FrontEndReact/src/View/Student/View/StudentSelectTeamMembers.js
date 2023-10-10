import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import SelectTeamMembers from './SelectTeamMembers';
import { API_URL } from '../../../App';

// TODO: Fetch all the students and save them into a team
class StudentSelectTeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: null,
            students: null,
			// NOTE: Might not need teamss
			teams: [],
			users: []
        };
    }
	// NOTE: Might need to check if the student is already in a team
    componentDidMount() {
        fetch(API_URL + `/team`) 
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
