import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class TeamDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                 <Box className="page-spacing">
                    <MainHeader
                        course={this.props.chosenCourse["course_name"]} 
                        number={this.props.chosenCourse["course_number"]}
                        setNewTab={this.props.setNewTab} 
                        activeTab={this.props.activeTab} 
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h4">Teams</Typography>
                        <Box sx={{display:"flex", gap:"20px"}}>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    console.log("Auto Assign!")
                                }}
                        >   
                            Auto Assign
                        </Button>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    this.props.setNewTab("AdminTeamBulkUpload");
                                }}
                        >   
                            Bulk Upload
                        </Button>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    // this.props.setAddTeamTabWithUsers(this.state.users, "AddTeam");
                                }}
                        >   
                            Add Team
                        </Button>
                        </Box>
                    </Box>
                    <Box className="table-spacing">
                        <AdminViewTeams
                            show={"ViewTeams"}
                            team={null}
                            addTeam={null}
                            users={null}
                            setNewTab={this.props.setNewTab}
                            chosenCourse={this.props.chosenCourse}
                            setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                            setAddTeamTabWithUsers={this.props.setAddTeamTabWithUsers}
                        />
                    </Box> 
                </Box>
            </React.Fragment>
        )
    }
}

export default TeamDashboard;