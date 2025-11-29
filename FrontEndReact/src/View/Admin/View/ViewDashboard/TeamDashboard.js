import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewTeams from '../ViewTeams/AdminViewTeams.js';
import MainHeader from '../../../Components/MainHeader.js';
import { Box } from '@mui/material';

/**
 * Creates an instance of the TeamDashboard component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * Components:
 * @see MainHeader.js
 * @see AdminViewTeams.js
 * 
 * Data:
 * No direct data fetching or management in this component.
 * - Handled by AdminViewTeams component.
 */

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