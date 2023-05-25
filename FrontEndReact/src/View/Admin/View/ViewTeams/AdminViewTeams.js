import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';

class AdminViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: [],
        }
    }
    componentDidMount() {
        fetch("http://127.0.0.1:5000/api/team")
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
    }
    render() {
        const { error, errorMessage, isLoaded, teams } = this.state;
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
        } else {
            return(
                <div className='container'>
                    <ViewTeams
                        course={this.props.course}
                        teams={teams}
                        setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                    />
                </div>
            )
        }
    }
}

export default AdminViewTeams;