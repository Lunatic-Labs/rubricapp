import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import SelectTeamMembers from './SelectTeamMembers';

class StudentSelectTeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: null,
            students: null
        };
    }
    componentDidMount() {
        // 
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