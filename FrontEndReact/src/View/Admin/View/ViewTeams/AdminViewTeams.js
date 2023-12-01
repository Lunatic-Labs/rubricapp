import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewTeams from './ViewTeams';
import AdminAddTeam from '../../Add/AddTeam/AdminAddTeam';
import ErrorMessage from '../../../Error/ErrorMessage';
import AdminBulkUpload from '../../Add/AddTeam/AdminTeamBulkUpload';
import { API_URL } from '../../../../App';
import { Box, Button, Typography } from '@mui/material';

class AdminViewTeams extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null
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
        var adminViewTeams = navbar.adminViewTeams;
        var show = adminViewTeams.show;
        navbar.adminViewTeams.teams = teams;
        navbar.adminViewTeams.users = users;
        var first_last_names_list = [];
        var setNewTab = navbar.setNewTab;
        var setAddTeamTabWithUsers = navbar.setAddTeamTabWithUsers;
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
        } else if (show === "AddTeam") {
            for(var u = 0; u < users.length; u++) {
                first_last_names_list = [...first_last_names_list, users[u]["first_name"] + " " + users[u]["last_name"]];
            }
            navbar.adminViewTeams.first_last_names_list = first_last_names_list;
            return(
                <AdminAddTeam
                    navbar={navbar}
                />
            )
        } else if (show === "AdminTeamBulkUpload") {
            for(u = 0; u < users.length; u++) {
                first_last_names_list = [...first_last_names_list, users[u]["first_name"] + " " + users[u]["last_name"]];
            }
            navbar.adminViewTeams.first_last_names_list = first_last_names_list;
            return(
                <AdminBulkUpload
                    navbar={navbar}
                />
            )
        } else {
            return(
                <Box>
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Teams</Typography>
                        <Box sx={{display:"flex", gap:"20px"}}>
                            <Button className='primary-color'
                                    variant='contained' 
                                    onClick={() => {
                                        console.log("Auto Assign!");
                                    }}
                            >   
                                Auto Assign
                            </Button>
                            <Button className='primary-color'
                                    variant='contained' 
                                    onClick={() => {
                                        setNewTab("AdminTeamBulkUpload");
                                    }}
                            >   
                                Bulk Upload
                            </Button>
                            <Button className='primary-color'
                                    variant='contained' 
                                    onClick={() => {
                                        setAddTeamTabWithUsers(users);
                                    }}
                            >
                                Add Team
                            </Button>
                        </Box>
                    </Box>
                    <Box className="table-spacing">
                        <ViewTeams
                            navbar={navbar}
                        />
                    </Box>
                </Box>
            )
        }
    }
}

export default AdminViewTeams;