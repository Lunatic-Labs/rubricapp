import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';

class TeamDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <div className='container'>
                    <div className='row mt-5'>
                        <div className='row'>
                            <h1 className='mt-5'>Teams</h1>
                            <AdminViewTeams
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

export default TeamDashboard;