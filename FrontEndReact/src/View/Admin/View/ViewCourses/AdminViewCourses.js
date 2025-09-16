import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses.js';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseCourseRoles } from '../../../../utility.js';
import { Box, Button, Typography } from '@mui/material';
import Loading from '../../../Loading/Loading.js';
import Cookies from 'universal-cookie';

// AdminViewCourses is a component that displays the courses that are available to the admin.
// The admin can add a course by clicking the "Add Course" button.

class AdminViewCourses extends Component {
  constructor(props) {
      super(props);

      this.state = {
          errorMessage: null,
          isLoaded: false,
          courses: null
      }
  }

  componentDidMount() {
    genericResourceGET(`/course`, 'courses', this);
  }

  render() {
    const {
        errorMessage,
        isLoaded,
        courses
    } = this.state;

    if (errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Courses"}
                    errorMessage={errorMessage}
                />
            </div>
        )

    } else if (!isLoaded || !courses) {
        return(
            <Loading/>
        )
    }

    var navbar = this.props.navbar;
    var state = navbar.state;
    var course = state.course;
    var addCourse = state.addCourse;
    var setAddCourseTabWithCourse = navbar.setAddCourseTabWithCourse;

    navbar.adminViewCourses = {};
    navbar.adminViewCourses.courses = courses;
    navbar.adminViewCourses.courseRoles = parseCourseRoles(courses);

    if(course === null && addCourse === null) {
        return(
            <>
                <Box sx={{ 
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "right",
                    alignSelf: "stretch"}}>
                        <Typography aria-label='coursesTitle' sx={{fontWeight:'700'}} variant="h4">
                            Courses
                        </Typography>
                
                        { navbar.props.isAdmin &&
                            <>
                                <Button className='primary-color'
                                    variant='contained'
                                    onClick={() => {
                                        setAddCourseTabWithCourse([], null, "AddCourse");
                                    }}
                                    aria-label='addCourse'
                                >   
                                    Add Course
                                </Button>
                                <Button
                                    className='primary-color'
                                    variant='contained'
                                    onClick={async () => {
                                        const cookies = new Cookies();
                                        
                                        // Store the admin credentials temporarily
                                        const adminUser = cookies.get('user');
                                        const adminAccessToken = cookies.get('access_token');
                                        const adminRefreshToken = cookies.get('refresh_token');
                                        
                                        // Store admin state in sessionStorage for switching back
                                        sessionStorage.setItem('adminCredentials', JSON.stringify({
                                            user: adminUser,
                                            access_token: adminAccessToken,
                                            refresh_token: adminRefreshToken
                                        }));
                                        
                                        // Create a student view by modifying the user object
                                        const studentViewUser = {
                                            ...adminUser,
                                            isAdmin: false,
                                            isSuperAdmin: false,
                                            viewingAsStudent: true
                                        };
                                        
                                        // Update cookies with student view
                                        cookies.set('user', studentViewUser, {sameSite: 'strict'});
                                        
                                        // Force re-render of the entire app
                                        window.location.reload();
                                    }}
                                    aria-label='view as student'
                                >
                                    View as Student
                                </Button>
                                
                            </>
                        }
                </Box>
                <Box>
                    <ViewCourses
                        navbar={navbar}
                    />
               </Box>
            </> 
        )

    } else {
        return(
            <AdminAddCourse
                navbar={navbar}
            />
        )
    }
  }
}

export default AdminViewCourses;