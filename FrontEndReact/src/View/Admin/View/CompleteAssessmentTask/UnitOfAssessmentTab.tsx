import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { Tab } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { Box } from '@mui/material';
import StatusIndicator from './StatusIndicator';
import {StatusIndicatorState} from './StatusIndicator';
import {getUnitCategoryStatus} from './cat_utils';
import Cookies from 'universal-cookie';

/**
 * This component is used to display the tabs for the names in the unit of assessment
 * in the complete assessment task page.
 * It will display the team or individual name and the status of the unit.
 * The name displayed is stored in the ATUnit Objects stored in the units array.
 *
 * @param {Object} props
 * @param {Array} props.units - Array of ATUnit objects
 * @param {Array} props.checkins - Array of checkins objects
 * @param {Object} props.navbar - Navbar object
 * @param {Number} props.currentUnitTabIndex - Index of the current unit tab
 * @param {Function} props.handleUnitTabChange - Function to handle the change of unit tab
 * @param {Boolean} props.hideUnits - Bool that represents if there are units to hide.
 * @param {Boolean} props.usingTeams - Bool that represents if the person is using teams.
 * 
 * @param {boolean} state.usingTeams - Bool that represents if we are on a valid tab when hiding other tabs.
 */
class UnitOfAssessmentTab extends Component {
    props: any;
    render() {
        const units = this.props.units;
        const hideUnits = this.props.hideUnits;

        const unitTabsList = [];
        
        const cookies = new Cookies();
        const currentUserId = cookies.get("user")["user_id"];

        for (let index = 0; index < units.length; index++){
            let currentUnit = units[index];
            
            if (hideUnits && currentUnit["team"]["observer_id"] !== currentUserId){continue;}

            const unitName = currentUnit.displayName;
            const unitId = currentUnit.id;
            const unitTooltip = currentUnit.getCheckedInTooltip(this.props.checkins);

            let unitStatus;
            
            if (currentUnit.isDone === true) {
                unitStatus = StatusIndicatorState.COMPLETED;
            } else {
                const isNotStarted = currentUnit.categoryNames().every((categoryName: any) => {
                    return getUnitCategoryStatus(currentUnit, this.props.navbar.state.chosenAssessmentTask, categoryName) === StatusIndicatorState.NOT_STARTED;
                });

                if (isNotStarted) {
                    unitStatus = StatusIndicatorState.NOT_STARTED;
                } else {
                    unitStatus = StatusIndicatorState.IN_PROGRESS;
                }
            }

            unitTabsList.push(
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
                    value={index}
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
                        border: this.props.currentUnitTabIndex === index ? '2px solid #2E8BEF ' : '2px solid gray',
                        '&.Mui-selected': {
                            color: '#2E8BEF '
                        },
                    }}
                /> 
            )
        };

        return (
            <Tabs
                value={this.props.currentUnitTabIndex}

                onChange={(event: any, newUnitTabIndex: any) => {
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
                {unitTabsList}
            </Tabs>
        );
    }
}

export default UnitOfAssessmentTab;