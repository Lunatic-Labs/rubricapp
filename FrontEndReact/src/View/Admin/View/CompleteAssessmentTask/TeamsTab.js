import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import StatusIndicator from './StatusIndicator';

class TeamsTab extends Component {
    
    render() {
        var navbar = this.props.navbar;
        var completeAssessmentTask = navbar.completeAssessmentTask;
        var teams = completeAssessmentTask.teams;

        var teamList = []
        
        for(var i = 0; i < teams.length; i++) {
            var currentTeam = teams[i];
            var teamName = currentTeam["team_name"];
            var teamId = currentTeam["team_id"]
            var teamMembers = this.props.teamInfo[2];
            // TODO: Display teamMembers when hovered over team tab!!!
            console.log(teamMembers);

            navbar.teamComponent = {};
            navbar.teamComponent.name = teamName;
            navbar.teamComponent.active = this.props.currentTeamTab === i
            navbar.teamComponent.id = i;
            navbar.teamComponent.teamId = teamId;
            navbar.teamComponent.changeTeam = this.props.changeTeam;

            var teamNames = []

            for(var index = 0; index < teamMembers.length; index++){
                teamNames.push(
                    <Box>
                        {teamMembers[index]["first_name"]} 
                        &nbsp;
                        {teamMembers[index]["last_name"]}
                    </Box>
                )
            }

            teamList.push(
                <Tab
                    label={
                        <Box sx={{
                            display:"flex", 
                            flexDirection:"row", 
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Tooltip title={teamNames}>
                                <span>{teamName}</span>
                            </Tooltip>
                            {/* <StatusIndicator status='completed'/> */}
                        </Box>
                    }
                    value={i}
                    key={i}
                    sx={{
                        maxWidth: 200,
                        maxHeight: 10,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.props.currentTeamTab === i ? '2px solid #2E8BEF ' : '2px solid gray',
                        '&.Mui-selected': {
                            color: '#2E8BEF '
                        },
                    }}
                /> 
            )

        }
        return (
            <React.Fragment> 
                <Tabs
                    value={this.props.teamValue}
                    onChange={this.props.handleTeamChange}
                    onClick={this.props.changeTeam(this.props.teamValue)}
                    variant="scrollable"
                    scrollButtons
                    aria-label="visible arrows tabs example"
                    sx={{
                        width: "100%",
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                        }, 
                        [`& .MuiTabs-indicator`]: { 
                            display: 'none' 
                        },
                    }}
                >
                    {teamList}
                </Tabs>
            </React.Fragment>
        )
    }
}

export default TeamsTab;