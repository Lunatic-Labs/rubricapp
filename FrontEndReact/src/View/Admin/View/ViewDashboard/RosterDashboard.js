import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class RosterDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        navbar.state.user = null;
        navbar.state.addUser = null;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
        var setNewTab = navbar.setNewTab;
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <MainHeader
                        navbar={navbar}
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Roster</Typography>
                        <Box sx={{display:"flex", gap:"20px"}}>
                            <Button
                                className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    setNewTab("StudentDashboard");
                                }}
                            >
                                Student Dashboard
                            </Button>
                            <Button
                                className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    setAddUserTabWithUser(null, null);
                                }}
                            >
                                Add Student
                            </Button>
                        </Box>
                    </Box>
                    <Box className="table-spacing">
                        <AdminViewUsers
                            navbar={navbar}
                        />
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default RosterDashboard;