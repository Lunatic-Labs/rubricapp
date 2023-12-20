import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import StudentViewTeams from './View/StudentViewTeams';
import StudentViewAssessmentTask from '../Student/View/AssessmentTask/StudentViewAssessmentTask';

// The StudentDashboard component contains the two sub components of
// StudentViewAssessmentTask and StudentViewTeams!
// If additional components are needed, please add and import here!
class StudentDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        navbar.studentViewTeams = {};
        navbar.studentViewTeams.show = "ViewTeams";
        navbar.studentViewTeams.team = null;
        navbar.studentViewTeams.addTeam = null;
        navbar.studentViewTeams.users = null;
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1>My Assessment Tasks</h1>
                            <StudentViewAssessmentTask
                                navbar={navbar}
                            />
                        </div>
                    </div>
                </div>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1>My Team</h1>
                            <StudentViewTeams
                                navbar={navbar}
                            />
                        </div>
                    
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default StudentDashboard;
