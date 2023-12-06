import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ConfirmCurrentTeamTable from './ConfirmCurrentTeam';
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';

// NOTE: Using Team_routes.py

// TODO: Fetch students team and display all students in the team
class StudentConfirmCurrentTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorMessage: null,
      isLoaded: false,
      currentTeam: null,
      students: null
    };
  }
  componentDidMount() {
    fetch(API_URL + `/team?team_id=${this.props.team_id}`)
    .then(res => res.json())
    .then((result) => {
      if(result["success"]===false) {
        this.setState({
          isLoaded: true,
          errorMessage: result["message"]
        })
      } else {
        this.setState({
          isLoaded: true,
          currentTeam: result["content"]["teams"][0]
        })
    }},
    (error) => {
      this.setState({
        isLoaded: true,
        error: error
      })
    })
    fetch(API_URL + `/user?team_id?={currentTeam}`)
    .then(res => res.json())
    .then((result) => {
      if(result["success"]===false) {
        this.setState({
          isLoaded: true,
          errorMessage: result["message"]
        })
      } else {
        this.setState({
          isLoaded: true,
          students: result["content"]["users"][0]
        })
    }},
    (error) => {
      this.setState({
        isLoaded: true,
        error: error
      })
    })
  }

  render() {
    const {
      error,
      errorMessage,
      isLoaded,
      currentTeam,
      students
    } = this.state;
    if(error) {
      return(
        <div className='container'>
          <ErrorMessage
            fetchedResource={"Team"}
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
        <ConfirmCurrentTeamTable
          currentTeam={currentTeam}
          students={students}
        />
      )
    }
  }
}

export default StudentConfirmCurrentTeam;
