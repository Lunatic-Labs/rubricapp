import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './TeamMembers';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';

class StudentTeamMembers extends Component {
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
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        fetch(API_URL + `/user?team_id=${team["team_id"]}`)
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
                        users: result['content']['users'][0],
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
        const {
            error,
            errorMessage,
            isLoaded,
            users
        } = this.state;
        var navbar = this.props.navbar;
        navbar.studentTeamMembers = {};
        navbar.studentTeamMembers.users = users;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team Members"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Team Members"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !users) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else {
            return(
                <div className='container'>
                    <h1 className='mt-5'>Student View: Team Members</h1>
                    <ViewTeamMembers
                        navbar={navbar}
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

export default StudentTeamMembers;
