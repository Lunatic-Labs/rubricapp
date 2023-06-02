import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';

class RosterDashboard extends Component {
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
                                chosenCourse={this.props.chosenCourse}
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
                    
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default RosterDashboard;