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
            users: []
        }
    }
    componentDidMount() {
        fetch(`http://127.0.0.1:5000/api/user?team_id=${this.props.team["team_id"]}`)
        .then(res => res.json())
        .then(
            (result) => {
                if(result['success']===false) {
                    this.setState({
                        errorMessage: result['message'],
                        isLoaded: true
                    })
                } else {
                    this.setState({
                        users: result['content']['users'],
                        isLoaded: true
                    })
                }
            },
            (error) => {
                this.setState({
                    error: error,
                    isLoaded: true
                })
            }
        )
    }
    render() {
        const { error, errorMessage, isLoaded, users } = this.state;
        // console.log(this.props.team);
        // console.log(this.props.chosenCourse);
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
                    <h1 className='mt-5'>Team Members</h1>
                    <h2 className='mt-3'> {this.props.team["team_name"]}</h2>
                    <ViewTeamMembers
                        users={users}
                    />
                    <div className='d-flex justify-content-end'>
                        <button
                            className='mt-3 btn btn-primary'
                            onClick={() => {
                                console.log("Add Members!");
                            }}
                        >
                            Add Member
                        </button>
                    </div>
                </div>
            )
        }
    }
}

export default AdminViewTeamMembers;