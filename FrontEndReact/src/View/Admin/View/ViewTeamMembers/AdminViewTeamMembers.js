import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './ViewTeamMembers';

class AdminViewTeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: null,
            teamMembers: []
        }
    }
    // componentDidMount() {
    //     fetch("http://127.0.0.1:5000/api/team-members")
    // }
    render() {
        const { error, errorMessage, isLoaded, teamMembers } = this.state;
        // console.log(this.props.team);
        // console.log(this.props.course);
        if(error) {
            return(
                <div className='container'>
                    <h1 className='text-danger'>Fetching team members resulted in an error: { error.message }</h1>
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <h1 className='text-danger'>Fetching team members resulted in an error: { errorMessage }</h1>
                </div>
            )
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <ViewTeamMembers
                        teamMembers={teamMembers}
                    />
                </div>
            )
        }
    }
}

export default AdminViewTeamMembers;