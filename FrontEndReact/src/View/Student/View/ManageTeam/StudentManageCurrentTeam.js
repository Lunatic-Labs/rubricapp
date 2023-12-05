import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ManageCurrentTeamTable from './ManageCurrentTeam'; 
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';

// NOTE: Using Team_routes.py

// TODO: Fetch all the students and save them into a team
class StudentManageCurrentTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            isLoaded: false,
            teams: null
        };
    }
  // TODO: Fetch all the students in a team
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = this.state;
        var chosenCourse = this.props.chosenCourse;

        fetch(API_URL + `/team?course_id=${chosenCourse["course_id"]}`)
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
                    teams: result["content"]["teams"][0]
                })
            }
        },
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
      teams
    } = this.state;
    var navbar = this.props.navbar;
    if (error) {
      return(
        <div className='container'>
          <ErrorMessage
            fetchedResource={"Current Team"}
            errorMessage={errorMessage} 
          />  
        </div>
      )
    } else if (!isLoaded || !teams){
      return (
        <div className='container'>
          <h1>loading...</h1>
        </div>
      )
    } else {
        return(
            <>
                <ManageCurrentTeamTable
                  
                  navbar={navbar}
                />
            </>
        )
  }
  }
}

export default StudentManageCurrentTeam;
