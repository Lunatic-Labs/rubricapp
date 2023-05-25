import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask';

class AdminViewDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1 className='mt-5'>Roster</h1>
                            <AdminViewUsers
                                user={null}
                                addUser={null}
                                setNewTab={this.props.setNewTab}
                                setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                            />
                            <div className="d-flex justify-content-end gap-3">
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        // this.props.setNewTab("AddUser");
                                        console.log("Buldupload!");
                                    }}
                                >
                                   Bulk Upload 
                                </button>
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("AddUser");
                                    }}
                                    >
                                    Add User
                                </button>
                            </div>
                        </div>
                        <div className='row'>
                            <h1 className='mt-5'>Teams</h1>
                            <AdminViewTeams
                                setNewTab={this.props.setNewTab}
                                course={this.props.course}
                                setAddTeamTabWithTeam={this.props.setAddTeamTabWithTeam}
                            />
                            <div className='d-flex justify-content-end gap-3'>
                                <button
                                    className="mt-3 mb-3 btn btn-primary"
                                    onClick={() => {
                                        // this.props.setNewTab("AddTeam");
                                        console.log("Auto Assign Team");
                                    }}
                                >
                                    Auto Assign Teams
                                </button>
                                <button
                                    className="mt-3 mb-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("AddTeam");
                                    }}
                                >
                                    Add Team
                                </button>
                            </div>
                        </div>
                        <div className='row'>
                            <h1 className='mt-5'>Assessment Tasks</h1>
                            <AdminViewAssessmentTask
                                course={this.props.course}
                                setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                                setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                            />
                            <div className='d-flex justify-content-end'>
                                <button
                                    id="createAssessmentTaskButton"
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("AddTask");
                                    }}
                                >
                                    Add Task
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminViewDashboard;