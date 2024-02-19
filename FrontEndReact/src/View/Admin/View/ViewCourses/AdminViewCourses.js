import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses.js';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET, parseCourseRoles } from '../../../../utility.js';
import { Box, Button, Typography } from '@mui/material';



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
            <div className='container'>
                <h1>Loading...</h1>
            </div>
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
                    alignItems: "center",
                    alignSelf: "stretch"}}>
                        <Typography aria-label='coursesTitle' sx={{fontWeight:'700'}} variant="h5">
                            Courses
                        </Typography>
                
                        { navbar.props.isAdmin &&
                            <Button className='primary-color'
                                variant='contained'
                                onClick={() => {
                                    setAddCourseTabWithCourse([], null, "AddCourse");
                                }}
                            >   
                                Add Course
                            </Button>
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