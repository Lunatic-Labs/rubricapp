import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';

class TeamDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1>Teams</h1>
                            <h2 className='mt-3'> {this.props.chosenCourse["course_name"]} ({this.props.chosenCourse["course_number"]})</h2>
                            <AdminViewTeams
                                navbar={this.props.navbar}
                                chosenCourse={this.props.chosenCourse}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default TeamDashboard;