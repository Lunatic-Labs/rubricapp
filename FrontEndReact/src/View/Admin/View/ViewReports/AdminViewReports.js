import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewReports from './ViewReports';
import ErrorMessage from '../../../Error/ErrorMessage';

class AdminViewReports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            courses: null,
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
                        courses: result['content']['courses'][0]
                    });
                }
                console.log(this.props.courses);
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error: error
                })
            }
        );

        // fetch(`http://127.0.0.1:5000/api/rubric`)
        // .then(res => res.json())
        // .then(
        //     (result) => {
        //         if(result["success"]===false) {
        //             this.setState({
        //                 isLoaded: true,
        //                 errorMessage: result["message"]
        //             })
        //         } else {
        //             this.setState({
        //                 isLoaded: true,
        //                 courses: result['content']['courses'][0]
        //             });
        //         }
        //         console.log(this.props.courses);
        //     },
        //     (error) => {
        //         this.setState({
        //             isLoaded: true,
        //             error: error
        //         })
        //     }
        // );
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
      } else if (!isLoaded) {
          return(
              <div className='container'>
                  <h1>Loading...</h1>
              </div>
          )
      } else {
          return(
              <div className='container'>
                  <h1 className="text-center mt-5">Then Again ABCDEF</h1>
                  <ViewReports
                    courses={courses}
                  />
              </div>
          )
      }
    }
  }
  
  export default AdminViewReports;