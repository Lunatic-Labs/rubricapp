import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
// import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask';

class AssessmentDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1>Assessment Tasks</h1>
                            <h2 className='mt-3'> {this.props.chosenCourse["course_name"]} ({this.props.chosenCourse["course_number"]})</h2>
                            <AdminViewAssessmentTask
                                navbar={this.props.navbar}
                                chosenCourse={this.props.chosenCourse}
                            />
                            <div className='d-flex flex-row justify-content-end gap-3'>
                                <div className='d-flex justify-content-end'>
                                    <button
                                        id="importAssessmentTasksButton"
                                        className="mb-3 mt-3 btn btn-primary"
                                        onClick={() => {
                                            this.props.navbar.setNewTab("ImportTasks");
                                        }}
                                    >
                                        Import Tasks
                                    </button>
                                </div>
                                <div className='d-flex justify-content-end'>
                                    <button
                                        id="createAssessmentTaskButton"
                                        className="mb-3 mt-3 btn btn-primary"
                                        onClick={() => {
                                            this.props.navbar.setNewTab("AddTask");
                                        }}
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AssessmentDashboard;