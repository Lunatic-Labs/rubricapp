import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';
// import AdminViewTeams from '../ViewTeams/AdminViewTeams';

class RosterDashboard extends Component {
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
                        <Typography sx={{fontWeight:'700'}} variant="h5">Roster</Typography>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    this.props.setNewTab("AddUser");
                                }}
                        >   
                            Add Student
                        </Button>
                    </Box>
                    <Box className="table-spacing">
                        <AdminViewUsers
                            user={null}
                            addUser={null}
                            chosenCourse={this.props.chosenCourse}
                            setNewTab={this.props.setNewTab}
                            setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                        />
                    </Box> 
                </Box>
            </React.Fragment>
        )
    }
}

export default RosterDashboard;