import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import StudentViewTeams from './View/StudentViewTeams';
import StudentViewAssessmentTask from '../Student/View/StudentViewAssessmentTask';

class StudentDashboard extends Component {
    render() {
        return(
            <React.Fragment><React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1 className='mt-5'>My Assessment Tasks</h1>
                            <StudentViewAssessmentTask
                                chosenCourse={this.props.chosenCourse}
                                setNewTab={this.props.setNewTab}
                                setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                                setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                                setViewCompleteAssessmentTaskTabWithAssessmentTask={this.props.setViewCompleteAssessmentTaskTabWithAssessmentTask}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1 className='mt-5'>My Team</h1>
                            <StudentViewTeams
                                show={"ViewTeams"}
                                team={null}
                                addTeam={null}
                                users={null}
                                setNewTab={this.props.setNewTab}
                                chosenCourse={this.props.chosenCourse}
                                setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                                setAddTeamTabWithUsers={this.props.setAddTeamTabWithUsers}
                            />
                        </div>
                    
                    </div>
                </div>
                
            </React.Fragment>
            
        )
    }
}

export default StudentDashboard;