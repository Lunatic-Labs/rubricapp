import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCourses from './ViewCourses';

class AdminViewCourses extends Component {
  constructor(props) {
      super(props);
      this.state = {
          error: null,
          errorMessage: null,
          isLoaded: false,
          JSON: [],
      }
  }
  componentDidMount() {
      fetch("http://127.0.0.1:5000/api/course")
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
                      JSON: result['content']['courses']
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
    const { error, errorMessage, isLoaded, JSON } = this.state;
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
    } else {
        return(
            <div className='container'>
                <h1 className="text-center mt-5">Courses</h1>
                <ViewCourses courses={JSON} setAddCourseTabWithCourse={this.props.setAddCourseTabWithCourse}/>
            </div>
        )
    }
  }
}

export default AdminViewCourses;