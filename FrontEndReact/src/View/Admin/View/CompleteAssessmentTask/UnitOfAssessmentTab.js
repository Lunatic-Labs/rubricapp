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
 */
class UnitOfAssessmentTab extends Component {
    render() {
        const units = this.props.units;

<<<<<<< HEAD
        const unitList = [];

        units.forEach((currentUnit, i) => {
            const unitName = currentUnit.displayName;
            const unitId = currentUnit.id;
            const unitNames = currentUnit.checkedInNames;
=======
        const unitTabsList = [];

        units.forEach((currentUnit, index) => {
            const unitName = currentUnit.displayName;
            const unitId = currentUnit.id;
            const unitTooltip = currentUnit.getCheckedInTooltip(this.props.checkins);
>>>>>>> master

            let unitStatus;
            
            if (currentUnit.isDone === true) {
                unitStatus = StatusIndicatorState.COMPLETED;
<<<<<<< HEAD
            } else{
=======
            } else {
>>>>>>> master
                const isNotStarted = currentUnit.categoryNames().every(categoryName => {
                    return getUnitCategoryStatus(currentUnit, this.props.navbar.state.chosenAssessmentTask, categoryName) === StatusIndicatorState.NOT_STARTED;
                });

                if (isNotStarted) {
                    unitStatus = StatusIndicatorState.NOT_STARTED;
                } else {
                    unitStatus = StatusIndicatorState.IN_PROGRESS;
                }
            }

<<<<<<< HEAD
            unitList.push(
=======
            unitTabsList.push(
>>>>>>> master
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
<<<<<<< HEAD
                    value={i}
=======
                    value={index}
>>>>>>> master
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
        });

        return (
<<<<<<< HEAD
            <React.Fragment> 
                <Tabs
                    value={this.props.currentUnitTabIndex}

                    onChange={(event, newUnitTabIndex) => {
                        this.props.handleUnitTabChange(newUnitTabIndex);
                    }}
=======
            <Tabs
                value={this.props.currentUnitTabIndex}

                onChange={(event, newUnitTabIndex) => {
                    this.props.handleUnitTabChange(newUnitTabIndex);
                }}
>>>>>>> master

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
        )
    }
}

export default UnitOfAssessmentTab;