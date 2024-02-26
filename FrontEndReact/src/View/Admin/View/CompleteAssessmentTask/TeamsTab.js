import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import StatusIndicator from './StatusIndicator.js';



class TeamsTab extends Component {
    render() {
        var teams = this.props.form.teams;

        var teamList = []
        
        for(var i = 0; i < teams.length; i++) {
            var currentTeam = teams[i];
            var teamName = currentTeam["team_name"];
            var teamId = currentTeam["team_id"]
            var teamMembers = this.props.form.users[teamId];
            var checkin = this.props.checkin;
            var teamNames = [];

            if(teamMembers.length === 0){
                teamNames = [...teamNames, <Box key={0}> No Team Members Checked In</Box>]
            }

            else {        
                for(var index = 0; index < teamMembers.length; index++){
                    for (let i = 0; i < checkin.length; i++) {
                        const currentObject = checkin[i];
                      
                        if ('user_id' in currentObject && currentObject.user_id === teamMembers[index]["user_id"]) {
                            var firstName = teamMembers[index]["first_name"];
                            var lastName = teamMembers[index]["last_name"];
                            var fullName = firstName + " " + lastName;
                            teamNames = [...teamNames, <Box key={index}> {fullName} </Box>];
                        }
                    }
                }

                teamNames = teamNames.length === 0
                ? [<Box key={0}> No Team Members Checked In</Box>]
                : teamNames;
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
                            <StatusIndicator
                                status={this.props.isTeamCompleteAssessmentComplete(teamId)}
                            />
                        </Box>
                    }
                    value={teamId}
                    key={teamId}
                    sx={{
                        maxWidth: 250,
                        maxHeight: 10,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.props.currentTeamTab === teamId ? '2px solid #2E8BEF ' : '2px solid gray',
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
                    onChange={(event, newValue) => {
                        this.props.handleTeamChange(event, newValue);
                        this.props.handleTeamTabChange(newValue);
                    }}
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