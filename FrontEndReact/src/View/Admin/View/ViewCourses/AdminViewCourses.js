import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import { Box, Button, Typography } from '@mui/material';

class AdminViewCourses extends Component {
  constructor(props) {
      super(props);
      this.state = {
          error: null,
          errorMessage: null,
          isLoaded: false,
          courses: [],
      }
  }
  componentDidMount() {
    // Currently user_id is hardcoded to 2!
    fetch(API_URL + `/course?admin_id=${2}`)
    .then(res => res.json())
    .then(
        (result) => {
            if(result["success"]===false) {
                this.setState({
                    isLoaded: true,
                    errorMessage: result["message"]
                })
            } else {
                this.setState({
                    isLoaded: true,
                    courses: result['content']['courses']
                })
            }
        },
        (error) => {
            this.setState({
                isLoaded: true,
                error: error
            })
        }
    )
  }
  render() {
    const {
        error,
        errorMessage,
        isLoaded,
        courses
    } = this.state;
    var navbar = this.props.navbar;
    var state = navbar.state;
    var course = state.course;
    var addCourse = state.addCourse;
    var setNewTab = navbar.setNewTab;
    navbar.adminViewCourses = {};
    navbar.adminViewCourses.courses = courses;
    if(error) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Courses"}
                    errorMessage={error.message}
                />
            </div>
        )
    } else if(errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Courses"}
                    errorMessage={errorMessage}
                />
            </div>
        )
    } else if (!isLoaded) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )
    } else if (course && addCourse) {
        return(
            <Box>
                <AdminAddCourse
                    navbar={navbar}
                />
            </Box>
        )
    } else {
        return(
            <>  
                <Box className="page-spacing">
                    <Box sx={{ 
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"}}>
                            <Typography sx={{fontWeight:'700'}} variant="h4"> 
                                Courses
                            </Typography>
                        
                            <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    setNewTab("AddCourse");
                                }}
                            >   
                                Add Course
                            </Button>
                    </Box>  
                    <Box>
                        <ViewCourses
                            navbar={navbar}
                        /> 
                    </Box>
                </Box>
            </>
        )
    }
  }
}

export default AdminViewCourses;