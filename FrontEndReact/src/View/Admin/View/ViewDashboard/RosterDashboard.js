import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class RosterDashboard extends Component {
    render() {
        var props = this.props.navbar;
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <MainHeader
                        props={props}
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Roster</Typography>
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    props.setNewTab("AddUser");
                                }}
                        >   
                            Add Student
                        </Button>
                    </Box>
                    <Box className="table-spacing">
                        {props.user=null}
                        {props.addUser=null}
                        <AdminViewUsers
                            navbar={props}
                        />
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default RosterDashboard;