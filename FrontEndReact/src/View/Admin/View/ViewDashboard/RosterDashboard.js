import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box, Typography, Button } from '@mui/material';
import Cookies from 'universal-cookie';
import { restoreAdminCredentialsFromSession, saveAdminCredentialsToSession, setTestStudentCookies } from '../../../../utility.js';



class RosterDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
        const course = navbar.state.course;
        const courseId = course ? course.course_id : null;

        return(
            <>
                <MainHeader
                    navbar={navbar}
                />

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label="rosterTitle">Roster</Typography>

                    <Box sx={{display:"flex", gap:"20px"}}>
                        <Button
                            className='primary-color'
                            variant='contained'
                            onClick={async () => {
                                const cookies = new Cookies();
                                const courseId = course ? course.course_id : null;
                                // save admin creds
                                saveAdminCredentialsToSession(cookies);

                                try {
                                    const resp = await fetch(`/api/courses/${courseId}/test_student_token`, {
                                        method: 'GET',
                                        headers: { 'Authorization': 'Bearer ' + cookies.get('access_token') }
                                    });

                                    if (!resp.ok) {
                                        const err = await resp.json().catch(() => ({}));
                                        restoreAdminCredentialsFromSession();
                                        alert(err.msg || 'Failed to switch to demo student view.');
                                        return;
                                    }

                                    const data = await resp.json();
                                    setTestStudentCookies(data);
                                    window.location.reload();
                                } catch (e) {
                                    restoreAdminCredentialsFromSession();
                                    alert('Network error switching to demo student view.');
                                }

                            }}
                            aria-label='view as student'
                        >
                            View as Student
                        </Button>
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