import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewTeams from '../ViewTeams/AdminViewTeams.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box } from '@mui/material';



class TeamDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        navbar.adminViewTeams = {};
        navbar.adminViewTeams.show = "ViewTeams";
        var state = navbar.state;
        state.team = null;
        state.addTeam = null;
        state.users = null;
        return(
            <>
                <MainHeader
                    navbar={navbar}
                />

                <Box>
                    <AdminViewTeams
                        navbar={navbar}
                    />
                </Box>
            </>
        )
    }
}

export default TeamDashboard;