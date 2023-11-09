import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import MainHeader from '../../../Components/MainHeader';
import { Box } from '@mui/material';

class TeamDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                 <Box className="page-spacing">
                    <MainHeader
                        course={this.props.chosenCourse["course_name"]} 
                        number={this.props.chosenCourse["course_number"]}
                        setNewTab={this.props.setNewTab} 
                        activeTab={this.props.activeTab} 
                    />
                    <Box>
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
                    </Box> 
                </Box>
            </React.Fragment>
        )
    }
}

export default TeamDashboard;