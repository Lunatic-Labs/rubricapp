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
      fetch(API_URL + `/course?admin_id=${this.props.user["user_id"]}`)
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
    var course = this.props.course;
    var addCourse = this.props.addCourse;
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
    } else if (course || addCourse) {
        return(
            <div className="container">
                <AdminAddCourse
                    course={course}
                    addCourse={addCourse}
                    user={this.props.user}
                />
            </div>
        )
    } else {
        return(
            <>
                <Box sx={{ 
                    display: "flex",
                    padding: "var(--2, 16px) var(--6, 48px)",
                    justifyContent: "space-between",
                    alignItems: "center",
                    alignSelf: "stretch"}}>
                        <Typography sx={{fontWeight:'700'}} variant="h4"> 
                            Courses
                        </Typography>
                       
                        <Button sx={{backgroundColor:"#2E8BEF"}}
                            variant='contained' 
                            onClick={() => {
                                this.props.setNewTab("AddCourse");
                            }}
                        >   
                            Add Course
                        </Button>
                       
                </Box>  
                <Box sx={{padding: "var(--2, 16px) var(--6, 48px)"}}>
                    <ViewCourses
                        courses={courses}
                        setNewTab={this.props.setNewTab}
                        setAddCourseTabWithCourse={this.props.setAddCourseTabWithCourse}
                    /> 
                </Box>
            </>
        )
    }
  }
}

export default AdminViewCourses;