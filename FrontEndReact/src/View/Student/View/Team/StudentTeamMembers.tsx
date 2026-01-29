import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeamMembers from './TeamMembers';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';
import Loading from '../../../Loading/Loading';

interface StudentTeamMembersProps {
    navbar: any;
    team?: any;
    chosenCourse?: any;
}

interface StudentTeamMembersState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    users: any[] | null;
}

class StudentTeamMembers extends Component<StudentTeamMembersProps, StudentTeamMembersState> {
    constructor(props: StudentTeamMembersProps) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            users: null
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        var courseID = state.chosenCourse.course_id; 

        genericResourceGET(
            `/user?course_id=${courseID}&team_id=${team["team_id"]}&assign=${true}`,
            "users", this as any
        );
    }

    render() {
        const {
            isLoaded,
            errorMessage,
            users
        } = this.state;

        var navbar = this.props.navbar;
        navbar.studentTeamMembers = {};
        navbar.studentTeamMembers.users = users;

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !users) {
            return(
                <Loading />
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

                            //TO DO
                            // onClick={() => {
                                // console.log("Add Members!");
                            // }}
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