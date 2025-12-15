import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import Cookies from 'universal-cookie';
import { apiUrl } from '../../../../App.js';

class RosterDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSwitchingToStudent: false,  // Add spam protection flag
        };
    }

    render() {
        var navbar = this.props.navbar;
        var setAddUserTabWithUser = navbar.setAddUserTabWithUser;
        
        // Try different ways to get the course
        const course = navbar.state.course || 
                      navbar.state.chosenCourse || 
                      navbar.chosenCourse ||
                      (navbar.adminViewUsers && navbar.adminViewUsers.chosenCourse);
        
        const courseId = course ? course.course_id : null;
        const { isSwitchingToStudent } = this.state;  // Get flag from state

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
                            disabled={isSwitchingToStudent}  // Disable button during switch
                            onClick={async () => { // STUDENT VIEW BUTTON
                                // Prevent multiple clicks
                                if (this.state.isSwitchingToStudent) {
                                    console.log('Already switching to student view, ignoring click');
                                    return;
                                }

                                const cookies = new Cookies();
                                
                                // Check for course ID first
                                if (!courseId) {
                                    alert('No course selected');
                                    return;
                                }
                                
                                // Set switching flag
                                this.setState({ isSwitchingToStudent: true });
                                console.log('Starting switch to student view for course:', courseId);
                                
                                try {
                                    // Save admin credentials FIRST
                                    const adminCredentials = {
                                        user: cookies.get('user'),
                                        access_token: cookies.get('access_token'),
                                        refresh_token: cookies.get('refresh_token')
                                    };
                                    sessionStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
                                    console.log('Admin credentials saved');
                                    
                                    // Get test student token
                                    const response = await fetch(`${apiUrl}/courses/${courseId}/test_student_token`, {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${cookies.get('access_token')}`,
                                            'Content-Type': 'application/json'
                                        }
                                    });
                                                                       
                                    if (!response.ok) {
                                        const errorData = await response.json();
                                        console.error('Error response:', errorData);
                                        throw new Error(errorData.error || 'Failed to get test student token');
                                    }
                                    
                                    const data = await response.json();
                                    console.log('Test student data received:', data);

                                    if (data.access_token && data.user) {  // Check for data
                                        // Clear old cookies
                                        cookies.remove('access_token', { path: '/' });
                                        cookies.remove('refresh_token', { path: '/' });
                                        cookies.remove('user', { path: '/' });
                                        
                                        // Set test student cookies
                                        cookies.set('access_token', data.access_token, { 
                                            path: '/', 
                                            sameSite: 'strict' 
                                        });
                                        cookies.set('refresh_token', data.refresh_token, { 
                                            path: '/', 
                                            sameSite: 'strict' 
                                        });
                                        
                                        // Add viewing flags to user object
                                        const testUser = {
                                            ...data.user,
                                            viewingAsStudent: true,
                                            originalCourseId: courseId,
                                            viewingCourseName: course?.course_name || ''
                                        };
                                        cookies.set('user', testUser, { 
                                            path: '/', 
                                            sameSite: 'strict' 
                                        });
                                        
                                        // Store course info for navigation
                                        const courseData = {
                                            course_id: courseId,
                                            course_name: course?.course_name || 'Test Course',
                                            role_id: 6  // Student role
                                        };
                                        sessionStorage.setItem('chosenCourse', JSON.stringify(courseData));
                                        
                                        console.log('Cookies set, reloading page...');
                                        
                                        // Reload to apply changes
                                        window.location.reload();
                                        // Note: setState won't execute after reload, but that's OK
                                        
                                    } else {
                                        console.error('Unexpected response format:', data);
                                        throw new Error('Invalid response format from server');
                                    }
                                } catch (error) {
                                    console.error('Error switching to student view:', error);
                                    
                                    // Restore admin credentials on error
                                    const adminCredentialsStr = sessionStorage.getItem('adminCredentials');
                                    if (adminCredentialsStr) {
                                        try {
                                            const adminCredentials = JSON.parse(adminCredentialsStr);
                                            
                                            // Clear any partial test student cookies
                                            cookies.remove('access_token', { path: '/' });
                                            cookies.remove('refresh_token', { path: '/' });
                                            cookies.remove('user', { path: '/' });
                                            
                                            // Restore admin cookies
                                            cookies.set('access_token', adminCredentials.access_token, { 
                                                path: '/', 
                                                sameSite: 'strict' 
                                            });
                                            cookies.set('refresh_token', adminCredentials.refresh_token, { 
                                                path: '/', 
                                                sameSite: 'strict' 
                                            });
                                            cookies.set('user', adminCredentials.user, { 
                                                path: '/', 
                                                sameSite: 'strict' 
                                            });
                                            
                                            console.log('Admin credentials restored after error');
                                        } catch (restoreError) {
                                            console.error('Failed to restore admin credentials:', restoreError);
                                        }
                                    }
                                    
                                    // Clear the saved credentials since we've restored them
                                    sessionStorage.removeItem('adminCredentials');
                                    
                                    // Reset the switching flag
                                    this.setState({ isSwitchingToStudent: false });
                                    
                                    alert(`Failed to switch to student view: ${error.message}`);
                                }
                            }}
                            aria-label='view as student'
                            startIcon={isSwitchingToStudent ? <CircularProgress size={20} color="inherit" /> : null}
                        >
                            {isSwitchingToStudent ? 'Switching...' : 'View as Student'}
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