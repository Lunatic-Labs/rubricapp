import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
// import AdminViewTeams from '../ViewTeams/AdminViewTeams';

class RosterDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1>Roster</h1>
                            <h2 className='mt-3'> {this.props.chosenCourse["course_name"]} ({this.props.chosenCourse["course_number"]})</h2>
                            <AdminViewUsers
                                navbar={this.props.navbar}
                                user={null}
                                addUser={null}
                                chosenCourse={this.props.chosenCourse}
                            />
                            <div className="d-flex justify-content-end gap-3">
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.navbar.setNewTab("ViewConsent");
                                    }}
                                >
                                   View Consent
                                </button>
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.navbar.setNewTab("BulkUpload");
                                    }}
                                >
                                   Bulk Upload 
                                </button>
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.navbar.setNewTab("AddUser");
                                    }}
                                    >
                                    Add User
                                </button>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default RosterDashboard;