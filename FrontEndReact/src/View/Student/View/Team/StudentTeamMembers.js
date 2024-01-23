import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './TeamMembers.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';

class StudentTeamMembers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            isLoaded: null,
            users: null
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        genericResourceGET(
            `/user?team_id=${team["team_id"]}&assign=${true}`,
            "users", this
        );
    }
    render() {
        const {
            errorMessage,
            isLoaded,
            users
        } = this.state;

        var navbar = this.props.navbar;
        navbar.studentTeamMembers = {};
        navbar.studentTeamMembers.users = users;

        if (errorMessage) {
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
