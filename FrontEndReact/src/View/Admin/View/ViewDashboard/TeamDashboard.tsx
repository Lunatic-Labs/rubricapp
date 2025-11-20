// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewTeams from '../ViewTeams/AdminViewTeams.js';
import MainHeader from '../../../Components/MainHeader.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from '@mui/material';



class TeamDashboard extends Component {
    props: any;
    render() {
        var navbar = this.props.navbar;
        navbar.adminViewTeams = {};
        navbar.adminViewTeams.show = "ViewTeams";
        var state = navbar.state;
        state.team = null;
        state.addTeam = null;
        state.users = null;
        return(
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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