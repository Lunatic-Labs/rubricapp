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
                            <h1 className='mt-5'>Assessment Tasks</h1>
                            <AdminViewAssessmentTask
                                chosenCourse={this.props.chosenCourse}
                                setNewTab={this.props.setNewTab}
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

export default AssessmentDashboard;