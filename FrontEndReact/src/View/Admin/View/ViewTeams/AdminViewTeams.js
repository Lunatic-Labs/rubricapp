import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Add/AddTeam/AdminAddTeam';

class AdminViewTeams extends Component {
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
        fetch(`http://127.0.0.1:5000/api/team?course_id=${this.props.chosenCourse["course_id"]}`)
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
                        teams: result['content']['teams']
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
        fetch(
            `http://127.0.0.1:5000/api/user?course_id=${this.props.chosenCourse["course_id"]}&role_id=4`
        )
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
                        users: result['content']['users']
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
        const { error, errorMessage, isLoaded, teams, users } = this.state;
        if(error) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching teams resulted in an error: { error.message }</h1>
                </div>
            )
        } else if(errorMessage) {
            return(
                <div className='container'>
                    <h1 className="text-danger">Fetching teams resulted in an error: { errorMessage }</h1>
                </div>
            )
        } else if (!isLoaded) {
            return(
                <div className='container'>
                    <h1>Loading...</h1>
                </div>
            )
        } else if (this.props.show==="AddTeam" && users) {
            var first_last_names_list = [];
            for(var u = 0; u < this.props.users[0].length; u++) {
                first_last_names_list = [...first_last_names_list, this.props.users[0][u]["first_name"] + " " + this.props.users[0][u]["last_name"]];
            }
            return(
                <AdminAddTeam
                    team={this.props.team}
                    addTeam={this.props.addTeam}
                    users={this.props.users}
                    first_last_names_list={first_last_names_list}
                    chosenCourse={this.props.chosenCourse}
                />
            )
        } else if (users) {
            return(
                <div className='container'>
                    <ViewTeams
                        teams={teams}
                        users={users}
                        setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                    />
                    <div className='d-flex justify-content-end gap-3'>
                        <button
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                console.log("Auto Assign Team");
                            }}
                        >
                            Auto Assign Teams
                        </button>
                        <button
                            id="addTeamButton"
                            className="mt-3 mb-3 btn btn-primary"
                            onClick={() => {
                                this.props.setAddTeamTabWithUsers(users, "AddTeam");
                            }}
                        >
                            Add Team
                        </button>
                    </div>
                </div>
            )
        }
    }
}

export default AdminViewTeams;