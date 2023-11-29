import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import MainHeader from '../../../Components/MainHeader';
import { Box } from '@mui/material';

class TeamDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        navbar.AdminViewTeams.show = "ViewTeams";
        var state = navbar.state;
        state.team = null;
        state.addTeam = null;
        state.users = null;
        return(
            <React.Fragment>
                 <Box className="page-spacing">
                    <MainHeader
                        navbar={navbar}
                    />
                    <Box>
                        <AdminViewTeams
                            navbar={navbar}
                        />
                    </Box> 
                </Box>
            </React.Fragment>
        )
    }
}

export default TeamDashboard;