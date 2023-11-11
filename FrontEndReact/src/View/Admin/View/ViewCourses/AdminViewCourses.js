import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseCourseRoles } from '../../../../utility';

class AdminViewCourses extends Component {
  constructor(props) {
      super(props);
      this.state = {
          error: null,
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
        error,
        errorMessage,
        isLoaded,
        courses
    } = this.state;
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
    } else if (!isLoaded || !courses) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )
    } else if (this.props.course || this.props.addCourse) {
        return(
            <div className="container">
                <AdminAddCourse
                    navbar={this.props.navbar}
                    course={this.props.course}
                    addCourse={this.props.addCourse}
                    // TODO: Need to come back and update role_id for SuperAdmin View!
                    // role_id={this.props.role_id}
                />
            </div>
        )
    } else {
        return(
            <div className='container'>
                <h1 className="text-center mt-5">Courses</h1>
                <ViewCourses
                    navbar={this.props.navbar}
                    courses={courses}
                    courseRoles={parseCourseRoles(courses)}
                    // role_id={this.props.role_id}
                />
            </div>
        )
    }
  }
}

export default AdminViewCourses;