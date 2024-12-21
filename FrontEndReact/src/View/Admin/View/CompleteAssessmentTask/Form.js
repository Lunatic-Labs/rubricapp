import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section.js';
import { Box, Tab, Button } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import UnitOfAssessmentTab from './UnitOfAssessmentTab.js';
import StatusIndicator, { StatusIndicatorState } from './StatusIndicator.js';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import Cookies from 'universal-cookie';
import Alert from '@mui/material/Alert';
import { getUnitCategoryStatus } from './cat_utils.js';


/**
 * Creates an instance of the Form component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.usingTeams - Boolean indicating whether teams are being used for this form.
 * @param {Array<ATUnit>} props.units - Array of `ATUnit` class objects.
 * @param {Object} props.assessmentTaskRubric - The rubric for the assessment task.
 * @param {Object} props.navbar - The navbar object.
 * 
 * @property {boolean} state.usingTeams - Boolean indicating whether teams are being used for this form.
 * @property {Array<ATUnit>} state.units - Array of `ATUnit` class objects taken from props.units.
 * @property {number} state.currentUnitTabIndex - Index of the currently selected `ATUnit` from `units`.
 * @property {Array<Category>} state.categoryList - Array of `Category` objects using the current rubric.
 * @property {number} state.currentCategoryTabIndex - Index of the currently selected rubric `categoryList`.
 * @property {Object} state.section - Section object of the category `currentCategoryTabIndex` from `categoryList`.
 * @property {boolean} state.displaySavedNotification - Boolean indicating whether to display the pop-up window that confirms the assessment is saved.
 */
class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            usingTeams: this.props.usingTeams,
            units: this.props.units,
            currentUnitTabIndex: 0,
            categoryList: null,
            currentCategoryTabIndex: 0,
            section: null,
            displaySavedNotification: false
        }

        /**
         * @method handleUnitTabChange - Handles the change of the unit tab.
         * @param {number} newUnitTabIndex - The new index of the unit tab.
         */
        this.handleUnitTabChange = (newUnitTabIndex) => {
            if (this.state.currentUnitTabIndex !== newUnitTabIndex) {
                this.setState(
                    {
                        currentUnitTabIndex: newUnitTabIndex,
                        currentCategoryTabIndex: 0,
                    },
                    this.generateCategoriesAndSection
                );
            }
        };

        /**
         * @method handleCategoryChange - Handles the change of the category tab.
         * @param {number} newCategoryTabIndex - The new index of the category tab.
         */
        this.handleCategoryChange = (newCategoryTabIndex) => {
            if (this.state.currentCategoryTabIndex !== newCategoryTabIndex) {
                this.setState(
                    {
                        currentCategoryTabIndex: newCategoryTabIndex,
                    },
                    this.generateCategoriesAndSection
                );
            }
        };

        /**
         * @method modifyUnitCategoryInformation - Modifies a single property of a unit's category information (part of the ROCS data).
         * @param {number} unitIndex The index of the unit to modify.
         * @param {string} categoryName The name of the category to modify.
         * @param {string} propertyName The name of the category property to modify.
         * @param {any} propertyValue The value to set.
         */
        this.modifyUnitCategoryProperty = (unitIndex, categoryName, propertyName, propertyValue) => {
            if (this.state.units[unitIndex].isDone && !this.props.navbar.props.isAdmin) return;
            
            this.setState(
                prevState => {
                    const updatedUnits = [...prevState.units];
                    
                    updatedUnits[unitIndex] = updatedUnits[unitIndex].withNewRocsData(rocs => {
                        rocs[categoryName][propertyName] = propertyValue;
                    });
                    
                    return { units: updatedUnits };
                },
                () => {
                    this.generateCategoriesAndSection();
                }
            );
        };
        
        /**
         * @method getUnitCategoryStatus - Gets the status of a unit category.
         * @param {number} unitId - The ID of the unit.
         * @param {string} categoryName - The name of the category.
         * @returns {string} - The status of the unit category.
         */
        this.getUnitCategoryStatus = (unitId, categoryName) => {
            const unit = this.state.units[unitId];
            const assessmentTask = this.props.navbar.state.chosenAssessmentTask;
            
            return getUnitCategoryStatus(unit, assessmentTask, categoryName);
        }

        /**
         * @method generateCategoriesAndSection - Generates the categories and section for the current unit and category.
         */
        this.generateCategoriesAndSection = () => {
            const assessmentTaskRubric = this.props.assessmentTaskRubric;
            const categoryList = [];
            let section;
            
            // We sort assessmentTaskRubric["category_json"] by the index of each entry, since the the data gets
            // automatically sorted when it comes out of the backend

            Object.entries(assessmentTaskRubric["category_json"])
                .toSorted((a, b) => a[1].index - b[1].index)
                .forEach(([category, _], index) => {
                    categoryList.push(
                        <Tab label={
                            <Box sx={{ display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center", maxHeight: 10}}>
                                <span>{category}</span>

                                <StatusIndicator
                                    status={this.getUnitCategoryStatus(this.state.currentUnitTabIndex, category)}
                                />
                            </Box>
                        }

                        value={index} key={index}

                        sx={{
                            minWidth: 170,
                            padding: "",
                            borderRadius: "10px",
                            margin : "0 0px 0 10px",
                            border: this.state.currentCategoryTabIndex === index ? '2px solid #2E8BEF ' : '2px solid gray',
                            '&.Mui-selected': { color: '#2E8BEF ' }
                        }}/>
                    );

                    if (this.state.currentCategoryTabIndex === index) {
                        section = <Section
                            navbar={this.props.navbar}
                            isDone={this.state.units[this.state.currentUnitTabIndex].isDone}
                            category={category}
                            assessmentTaskRubric={this.props.assessmentTaskRubric}
                            currentUnitTabIndex={this.state.currentUnitTabIndex}
                            currentRocsData={this.state.units[this.state.currentUnitTabIndex].rocsData}
                            active={this.state.currentCategoryTabIndex === index}
                            key={index}
                            
                            modifyUnitCategoryProperty={this.modifyUnitCategoryProperty}
                            handleSubmit={this.handleSubmit}
                        />;
                    }
            });

            this.setState({
                categoryList: categoryList,
                section: section
            });
        }
        
        /**
         * @method areAllCategoriesCompleted - Checks if all categories are completed for the current unit.
         * @returns {boolean} - True if all categories are completed, false otherwise.
         */
        this.areAllCategoriesCompleted = () => {
            const currentUnit = this.state.units[this.state.currentUnitTabIndex];
            
            return currentUnit.categoryNames().every(category => {
                return this.getUnitCategoryStatus(this.state.currentUnitTabIndex, category) === StatusIndicatorState.COMPLETED;
            });
        };
        
        /**
         * 
         * @method handleSubmit - Handles the submission of the form.
         * @param {boolean} newIsDone - The new completion status of the unit.
         */
        this.handleSubmit = (newIsDone) => {
            const chosenAssessmentTaskId = this.props.navbar.state.chosenAssessmentTask["assessment_task_id"];
            const selectedUnitIndex = this.state.currentUnitTabIndex;
            const selectedUnit = this.state.units[selectedUnitIndex];
            
            const cookies = new Cookies();
            const currentUserId = cookies.get("user")["user_id"];
            const currentDate = new Date();
            
            const newCAT = selectedUnit.generateNewCAT(chosenAssessmentTaskId, currentUserId, currentDate, newIsDone);
            const newUnit = selectedUnit.withNewCAT(newCAT);
            
            let promise;
            
            if (selectedUnit.completedAssessmentTask) {
                const catId = selectedUnit.completedAssessmentTask["completed_assessment_id"];
                
                promise = genericResourcePUT(
                    `/completed_assessment?completed_assessment_id=${catId}`,
                    this,
                    JSON.stringify(newCAT),
                    { rawResponse: true }
                );
            } else {
                promise = genericResourcePOST(
                    `/completed_assessment?assessment_task_id=${chosenAssessmentTaskId}&${newUnit.getSubmitQueryParam()}`,
                    this,
                    JSON.stringify(newCAT),
                    { rawResponse: true }
                );
            }
            
            // Replace the selected unit with updated unit and display saving notification
            this.setState(
                prevState => {
                    const updatedUnits = [...prevState.units];
                    
                    updatedUnits[selectedUnitIndex] = newUnit;
    
                    return { 
                        displaySavedNotification: true,
                        units: updatedUnits,
                    };
                }
            );
            
            // Once the CAT entry has been updated, insert the new CAT entry into the unit object
            promise.then(result => {
                const completeAssessmentEntry = result?.["content"]?.["completed_assessments"]?.[0]; // The backend returns a list of a single entry
                
                if (completeAssessmentEntry) {
                    this.setState(
                        prevState => {
                            const updatedUnits = [...prevState.units];
                            
                            updatedUnits[selectedUnitIndex] = updatedUnits[selectedUnitIndex].withNewCAT(completeAssessmentEntry);
                            
                            return { units: updatedUnits };
                        }
                    );
                }
            });
            
            setTimeout(() => {
                this.setState({
                    displaySavedNotification: false
                });
            }, 3000);
        };
    }

    componentDidMount() {
        this.generateCategoriesAndSection();
    }
    
    render() {
        return (
            <Box sx={{mt:1}} id="formDiv" className="assessment-task-spacing">
                <Box sx={{
                    display:"flex",
                    justifyContent:"end",
                    gap:"20px",
                    height: "1.5rem"
                }}>
                    { this.state.displaySavedNotification &&
                        <Alert severity={"success"} sx={{ height: "fit-content" }}>Assessment Saved!</Alert>
                    }

                    { !this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly &&
                        <Button
                            id="formSubmitButton"
                            variant="contained"
                            color="primary"
                            aria-label="saveButton"

                            onClick={() => {
                                this.handleSubmit(this.areAllCategoriesCompleted());
                            }}

                            disabled={!this.areAllCategoriesCompleted()}
                        >
                            Done
                        </Button>
                    }
                </Box>

                <Box>
                    {this.props.roleName !== "Student" &&
                        <Box sx={{pb: 1}} className="content-spacing">
                            <UnitOfAssessmentTab
                                navbar={this.props.navbar}
                                currentUnitTabIndex={this.state.currentUnitTabIndex}
                                units={this.state.units}
                                checkins={this.props.checkins}
                                handleUnitTabChange={this.handleUnitTabChange}
                            />
                        </Box>
                    }

                    <Box sx={{mt: 1}}>
                        <Tabs
                            value={this.state.currentCategoryTabIndex} 
                        
                            onChange={(event, newCategoryTabIndex) => {
                                this.handleCategoryChange(newCategoryTabIndex);
                            }}

                            variant="scrollable"
                            scrollButtons
                            aria-label="visible arrows tabs"

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
                            {this.state.categoryList}
                        </Tabs>
                    </Box>
                </Box>

                {this.state.section}
            </Box>
        )
    }
}

export default Form;
