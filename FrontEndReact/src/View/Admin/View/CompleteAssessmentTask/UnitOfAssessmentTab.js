import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import StatusIndicator from './StatusIndicator.js';

// This component is used to display the tabs for the names in the unit of assessment (team or individual) 
// in the complete assessment task page.
// It will display the team or individual name and the status of the unit

class UnitOfAssessmentTab extends Component {
    render() {

        var units = this.props.form.units;

        var unitList = []

        for(var i = 0; i < units.length; i++) {        

            var currentUnit = units[i];
            var checkin = this.props.checkin;
            var unitNames = [];
            var ci=0;
            if (this.props.unitOfAssessment) {
                var unitName = currentUnit["team_name"];
                var unitId = currentUnit["team_id"];
                var unitMembers = this.props.form.teams_users[unitId];

                for(var index = 0; index < unitMembers.length; index++){
                    for (ci = 0; ci < checkin.length; ci++) {
                        const currentObject = checkin[ci];
                        
                        if ('user_id' in currentObject && currentObject.user_id === unitMembers[index]["user_id"]) {
                            var firstName = unitMembers[index]["first_name"];
                            var lastName = unitMembers[index]["last_name"];
                            var fullName = firstName + " " + lastName;
                            unitNames = [...unitNames, <Box key={index}> {fullName} </Box>];
                        }
                    }
                }

                unitNames = unitNames.length === 0
                ? [<Box key={0}> No Team Members Checked In</Box>]
                : unitNames;
            } else {
                unitName = currentUnit["first_name"] + " " + currentUnit["last_name"];
                unitId = currentUnit["user_id"];
                for (ci = 0; ci < checkin.length; ci++) {
                    if (checkin[ci].user_id === unitId)
                    {
                        unitNames = [ <Box key={0}> Checked In </Box>];
                    }  
                } 
            }
            unitList.push(
                <Tab
                    label={
                        <Box sx={{
                            display:"flex", 
                            flexDirection:"row", 
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Tooltip title={unitNames}>
                                <span>{unitName}</span>
                            </Tooltip>
                            <StatusIndicator
                                status={this.props.form.unitInfo[unitId].done}
                            />
                        </Box>
                    }
                    value={unitId}
                    key={unitId}
                    sx={{
                        maxWidth: 250,
                        maxHeight: 10,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.props.currentUnitTab === unitId ? '2px solid #2E8BEF ' : '2px solid gray',
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
                    value={this.props.unitValue}
                    onChange={(event, newValue) => {
                        this.props.handleUnitChange(event, newValue);
                        this.props.handleUnitTabChange(newValue);
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
                    {unitList}
                </Tabs>
            </React.Fragment>
        )
    }
}

export default UnitOfAssessmentTab;