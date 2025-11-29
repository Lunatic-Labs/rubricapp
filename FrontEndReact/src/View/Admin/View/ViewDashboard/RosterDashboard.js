import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box, Typography, Button } from '@mui/material';

/**
 * Creates an instance of the RosterDashboard component.
 * Main dashboard for managing course roster.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * Components:
 * @see MainHeader.js
 * @see AdminViewUsers.js
 * 
 * Actions:
 * - Student Bulk Upload: Opens the bulk upload interface for adding multiple students.
 * - Add User: Opens the interface to add a single user to the course.
 * 
 * Data:
 * No direct data fetching or management in this component.
 * - Handled by AdminViewUsers component.
 * 
 */

class RosterDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;

        return(
            <>
                <MainHeader
                    navbar={navbar}
                />

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="rosterTitle">Roster</Typography>

                    <Box sx={{display:"flex", gap:"20px"}}>
                        {/**
                         * @button Student Bulk Upload - Button to open the bulk upload interface.
                         */}
                        <Button
                            className='primary-color'
                            variant='contained' 
                            onClick={() => {
                                navbar.setNewTab("BulkUpload");
                            }}
                            aria-label='studentBulkUploadButton'
                        >
                            Student Bulk Upload
                        </Button>
                        {/**
                         * @button Add User - Button to open the add user interface.
                         */}

                        <Button
                            className='primary-color'
                            variant='contained' 
                            onClick={() => {
                                setAddUserTabWithUser([], null);
                            }}
                            aria-label='addUserButton'
                        >
                            Add User
                        </Button>
                    </Box>
                </Box>

                <Box className="table-spacing">
                    <AdminViewUsers
                        navbar={navbar}
                    />
                </Box>
            </>
        )
    }
}

export default RosterDashboard;