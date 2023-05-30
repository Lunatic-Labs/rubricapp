import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse';

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
      fetch(`http://127.0.0.1:5000/api/course?admin_id=${this.props.user["user_id"]}`)
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
    const { error, errorMessage, isLoaded, courses} = this.state;
    var course = this.props.course;
    var addCourse = this.props.addCourse;
    if(error) {
        return(
            <div className='container'>
                <h1 className="text-danger">Fetching courses resulted in an error: { error.message }</h1>
            </div>
        )
    } else if(errorMessage) {
        return(
            <div className='container'>
                <h1 className="text-danger">Fetching courses resulted in an error: { errorMessage }</h1>
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
            <div className='container'>
                <h1 className="text-center mt-5">Courses</h1>
                <ViewCourses
                    courses={courses}
                    setNewTab={this.props.setNewTab}
                    setAddCourseTabWithCourse={this.props.setAddCourseTabWithCourse}
                />
            </div>
        )
    }
  }
}

export default AdminViewCourses;