import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class RosterDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <MainHeader
                        navbar={navbar}
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Roster</Typography>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    navbar.setNewTab("AddUser");
                                }}
                        >   
                            Add Student
                        </Button>
                    </Box>
                    <Box className="table-spacing">
                        {navbar.state.user=null}
                        {navbar.state.addUser=null}
                        {/* Work on AdminViewUsers next! */}
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