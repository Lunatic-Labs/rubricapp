import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET } from '../../../../utility';

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
    genericResourceGET(`/course`,'courses', this);
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