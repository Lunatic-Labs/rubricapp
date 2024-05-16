import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam.js'
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import { CircularProgress } from '@mui/material';



class StudentManageCurrentTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            users: null
        };
    }

    componentDidMount() {
        var courseId = this.props.navbar.state.chosenCourse["course_id"];

        genericResourceGET(`/user?course_id=${courseId}`, "users", this);
    }

    render() {
        const {
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;

        if (errorMessage) {
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
                    <CircularProgress />
                </div>
            )

        } else {
            return(
                <BuildTeamTable 
                    navbar={navbar}
                    users={this.state.users}
                />
            )
        }
    }
}

export default StudentManageCurrentTeam;
