import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ErrorMessage from '../../../../Error/ErrorMessage';
import { API_URL } from '../../../../../App';
import ViewRatingsDD from './ViewRatingsDD';

class AdminViewTeamRatings extends Component {
  constructor(props) {
    super(props);
    this.state = {
        error: null,
        errorMessage: null,
        isLoaded: false,
        assessment_tasks: null
    }
  }
  componentDidMount() {
    fetch(API_URL + `/assessment_task?admin_id=${this.props.chosenCourse["admin_id"]}`)
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
                    assessment_tasks: result['content']['assessment_tasks'][0]
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
        assessment_tasks
    } = this.state;
    if(error) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={error.message}
                />
            </div>
        )
    } else if(errorMessage) {
        return(
            <div className='container'>
                <ErrorMessage
                    fetchedResource={"Assessment Tasks"}
                    errorMessage={errorMessage}
                />
            </div>
        )
    } else if (!isLoaded || !assessment_tasks) {
        return(
            <div className='container'>
                <h1>Loading...</h1>
            </div>
        )
    } else {
        return(
            <ViewRatingsDD
                assessment_tasks={assessment_tasks}
            />
        )
    }
  }
}

export default AdminViewTeamRatings;