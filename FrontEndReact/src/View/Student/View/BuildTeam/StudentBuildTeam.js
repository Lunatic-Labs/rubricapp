import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import BuildTeamTable from './BuildTeam.js'
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';



class StudentManageCurrentTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
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
            isLoaded,
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

        } else if (!isLoaded || !users) {
            return (
                <Loading />
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
