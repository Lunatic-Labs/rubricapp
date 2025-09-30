import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box, Typography, Button } from '@mui/material';
import Cookies from 'universal-cookie';
import { restoreAdminCredentialsFromSession, saveAdminCredentialsToSession} from '../../../../utility.js';
import { apiUrl } from '../../../../App.js';

class RosterDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
        
        // Try different ways to get the course
        const course = navbar.state.course || 
                      navbar.state.chosenCourse || 
                      navbar.chosenCourse ||
                      (navbar.adminViewUsers && navbar.adminViewUsers.chosenCourse);
        
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
                                
                                // Try to get courseId from multiple sources
                                let currentCourseId = courseId;
                                
                                // If still no courseId, try to get from URL params
                                if (!currentCourseId) {
                                    const urlParams = new URLSearchParams(window.location.search);
                                    currentCourseId = urlParams.get('course_id');
                                }
                                
                                // Make sure we have a courseId
                                if (!currentCourseId) {
                                    alert('No course selected. Please select a course first.');
                                    return;
                                }
                                
                                console.log('Using courseId:', currentCourseId);
                                console.log('API URL:', apiUrl);
                                
                                // save admin creds
                                saveAdminCredentialsToSession(cookies);

                                try {
                                    // Build the full URL
                                    const fullUrl = `${apiUrl}/courses/${currentCourseId}/test_student_token`;
                                    console.log('Fetching from:', fullUrl);
                                    console.log('Access token exists:', !!cookies.get('access_token'));
                                    
                                    const resp = await fetch(fullUrl, {
                                        method: 'GET',
                                        headers: { 
                                            'Authorization': `Bearer ${cookies.get('access_token')}`,
                                            'Content-Type': 'application/json'
                                        }
                                    });

                                    console.log('Response status:', resp.status);
                                    console.log('Response ok:', resp.ok);

                                    if (!resp.ok) {
                                        let errorMessage = `HTTP ${resp.status}`;
                                        try {
                                            const err = await resp.json();
                                            console.error('Error response body:', err);
                                            errorMessage = err.error || err.msg || errorMessage;
                                        } catch (parseError) {
                                            console.error('Could not parse error response');
                                        }
                                        
                                        restoreAdminCredentialsFromSession();
                                        alert(`Failed to switch to demo student view: ${errorMessage}`);
                                        return;
                                    }

                                    const data = await resp.json();
                                    console.log('Success response:', data);
                                    
                                    // In your View as Student button handler
                                    if (data.success) {
                                        // Set cookies with explicit options
                                        const cookieOptions = { 
                                            path: '/', 
                                            sameSite: 'strict',
                                            // Add these to ensure cookies are available immediately
                                            secure: false,  // Set to true if using HTTPS
                                            httpOnly: false  // Make sure JavaScript can read them
                                        };
                                        
                                        cookies.set('access_token', data.access_token, cookieOptions);
                                        cookies.set('refresh_token', data.refresh_token, cookieOptions);
                                        
                                        const testUser = {
                                            ...data.user,
                                            viewingAsStudent: true,
                                            originalCourseId: currentCourseId,
                                            viewingCourseName: course?.course_name || ''
                                        };
                                        cookies.set('user', testUser, cookieOptions);
                                        
                                        // Force a small delay to ensure cookies are set
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 100);
                                    } else {
                                        throw new Error(data.error || 'Failed to get test student token');
                                    }
                                } catch (e) {
                                    console.error('Full error object:', e);
                                    console.error('Error name:', e.name);
                                    console.error('Error message:', e.message);
                                    console.error('Error stack:', e.stack);
                                    
                                    restoreAdminCredentialsFromSession();
                                    
                                    // Check for specific error types
                                    if (e.name === 'TypeError' && e.message === 'Failed to fetch') {
                                        alert('Network error: Could not connect to the server. Please check:\n' +
                                              '1. The backend server is running\n' +
                                              '2. The API URL is correct: ' + apiUrl + '\n' +
                                              '3. CORS is properly configured');
                                    } else {
                                        alert(`Error switching to demo student view: ${e.message}`);
                                    }
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