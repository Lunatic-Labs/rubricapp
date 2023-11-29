import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Admin/Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../Error/ErrorMessage';
import { API_URL } from '../../../App';

class StudentViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: [],
            users: []
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        fetch(API_URL + `/team?course_id=${chosenCourse["course_id"]}`)
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        teams: result['content']['teams'][0]
                    })
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
        var url = (
            chosenCourse["use_tas"] ?
            API_URL + `/user?course_id=${chosenCourse["course_id"]}&role_id=4` :
            API_URL + `/user/${chosenCourse["admin_id"]}`
        );
        fetch(url)
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]===false) {
                    this.setState({
                        isLoaded: true,
                        errorMessage: result["message"]
                    })
                } else {
                    this.setState({
                        isLoaded: true,
                        users: result['content']['users'][0]
                    })
                }
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
    }
    render() {
        const {
            error,
            errorMessage,
            isLoaded,
            teams,
            users
        } = this.state;
        var navbar = this.props.navbar;
        var studentViewTeams = navbar.studentViewTeams;
        var show = studentViewTeams.show;
        navbar.adminViewTeams = {};
        navbar.adminViewTeams.teams = teams;
        navbar.adminViewTeams.users = users;
        if(error) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={error.message}
                    />
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )
        } else if (!isLoaded || !teams || !users) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (show==="AddTeam" && users) {
            var first_last_names_list = [];
            for(var u = 0; u < users.length; u++) {
                first_last_names_list = [...first_last_names_list, users[u]["first_name"] + " " + users[u]["last_name"]];
            }
            navbar.adminViewTeams.first_last_names_list = first_last_names_list;
            return(
                <AdminAddTeam
                    navbar={navbar}
                />
            )
        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        navbar={navbar}
                    />
                </div>
            )
        }
    }
}

export default StudentViewTeams;