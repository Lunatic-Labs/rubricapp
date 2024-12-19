import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import StatusIndicator from './StatusIndicator.js';
import {StatusIndicatorState} from './StatusIndicator.js';
import {getUnitCategoryStatus} from './cat_utils.js';

// This component is used to display the tabs for the names in the unit of assessment (team or individual) 
// in the complete assessment task page.
// It will display the team or individual name and the status of the unit

class UnitOfAssessmentTab extends Component {
    render() {
        const units = this.props.units;

        const unitList = [];

        units.forEach((currentUnit, i) => {
            const unitName = currentUnit.displayName;
            const unitId = currentUnit.id;
            const unitTooltip = currentUnit.getCheckedInTooltip(this.props.checkins);

            let unitStatus;
            
            if (currentUnit.isDone === true) {
                unitStatus = StatusIndicatorState.COMPLETED;
            } else {
                const isNotStarted = currentUnit.categoryNames().every(categoryName => {
                    return getUnitCategoryStatus(currentUnit, this.props.navbar.state.chosenAssessmentTask, categoryName) === StatusIndicatorState.NOT_STARTED;
                });

                if (isNotStarted) {
                    unitStatus = StatusIndicatorState.NOT_STARTED;
                } else {
                    unitStatus = StatusIndicatorState.IN_PROGRESS;
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
                            <Tooltip title={unitTooltip}>
                                <span>{unitName}</span>
                            </Tooltip>
                            <StatusIndicator
                                status={unitStatus}
                            />
                        </Box>
                    }
                    value={i}
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
        });

        return (
            <React.Fragment> 
                <Tabs
                    value={this.props.currentUnitTabIndex}

                    onChange={(event, newUnitTabIndex) => {
                        this.props.handleUnitTabChange(newUnitTabIndex);
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

                        '& .MuiTab-root': {
                            border: '2px solid',
                            '&.Mui-selected': {
                                backgroundColor: '#D9D9D9',
                                color: 'inherit',
                            }
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