import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';
import AdminAddCourse from '../../Add/AddCourse/AdminAddCourse';
import ErrorMessage from '../../../Error/ErrorMessage';
import Cookies from 'universal-cookie';

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
    const cookies = new Cookies();
    const user_id = cookies.get('user_id');
    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');
    if(access_token && refresh_token && user_id) {
        fetch(
          `http://127.0.0.1:5000/api/course?user_id=${user_id}&admin_id=${user_id}`,
          {
              headers: {
                  "Authorization": "Bearer " + access_token
              }
          }
        )
        .then(res => res.json())
        .then(
            (result) => {
                if(result["success"]) {
                    this.setState({
                        isLoaded: true,
                        courses: result['content']['courses']
                    })
                } else {
                    const msg = result['msg'];
                    if(msg==="BlackListed") {
                        cookies.remove('access_token');
                        cookies.remove('refresh_token');
                        cookies.remove('user_id');
                        window.location.reload(false);
                    } else if(msg==="Token has expired") {
                        cookies.remove('access_token');
                    } else {
                        this.setState({
                            isLoaded: true,
                            errorMessage: result["message"]
                        })
                    }
                }
            },
            (error) => {
                console.log("error: ", error);
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        )
    }
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