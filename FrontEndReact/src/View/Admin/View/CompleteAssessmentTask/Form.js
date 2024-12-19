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


class Form extends Component {
    constructor(props) {
        super(props);

        /**
         * unitOfAssessment: boolean of whether teams are being used for this form
         * units: array of `ATUnit` class objects
         * currentUnitTabIndex: index of ATUnit from `units` that is currently selected 
         * categoryList: array of `Category` objects using the current rubric
         * currentCategoryTabIndex: index of rubric `categoryList` that is currently selected
         * section: Section object of category `currentCategoryTabIndex` from `categoryList`
         * displaySavedNotification:
         */

        this.state = {
            unitOfAssessment: this.props.unitOfAssessment,
            units: this.props.form.units,
            currentUnitTabIndex: 0,
            categoryList: null,
            currentCategoryTabIndex: 0,
            section: null,
            displaySavedNotification: false
        }

        this.handleUnitTabChange = (newUnitTabIndex) => {
            var chosenCompleteAssessmentTask = this.findCompletedAssessmentTask(this.props.navbar.state.chosenAssessmentTask["assessment_task_id"], newUnitTabIndex, this.props.completedAssessments);
            this.setState({
                    currentUnitTabIndex: newUnitTabIndex,
                    currentCategoryTabIndex: 0,
                    chosenCompleteAssessmentTask: chosenCompleteAssessmentTask ? chosenCompleteAssessmentTask : null
                },
//TODO:  fix in the case that chosenCompleteAssessmentTask is null
            this.generateCategoriesAndSection
            );

        };

        this.handleCategoryChange = (newCategoryTabIndex) => {
            if (this.state.currentCategoryTabIndex !== newCategoryTabIndex) {
                this.setState({
                        currentCategoryTabIndex: newCategoryTabIndex
                    },

                    this.generateCategoriesAndSection
                );
            }
        };

        this.deepClone = (obj) => {
            if (Array.isArray(obj)) {
                return obj.map(item => this.deepClone(item));

            } else if (typeof obj === 'object' && obj !== null) {
                const cloned = {};

                for (let key in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        cloned[key] = this.deepClone(obj[key]);
                    }
                }

                return cloned;

            } else {
                return obj;
            }
        }
        
        /**
         * Modifies a unit's category information (part of the ROCS data).
         * 
         * @param {number} unitIndex The index of the unit to modify.
         * @param {string} categoryName The name of the category to modify.
         * @param {function(object)} modifier Callback that modifies the category data.
         */
        this.modifyUnitCategoryInformation = (unitIndex, categoryName, modifier) => {
            if (this.isUnitCompleteAssessmentComplete(unitIndex) && !this.props.navbar.props.isAdmin) return;
            
            this.setState(
                prevState => {
                    const updatedUnits = [...prevState.units];
                    
                    updatedUnits[unitIndex] = updatedUnits[unitIndex].withNewRocsData(rocs => {
                        modifier(rocs[categoryName]);
                    });
                    
                    return { units: updatedUnits };
                },
                () => {
                    this.generateCategoriesAndSection();
                }
            );
        };

        this.setSliderValue = (unitIndex, categoryName, rating) => {
            this.modifyUnitCategoryInformation(unitIndex, categoryName, category => {
                category["rating"] = rating;
            });
        };

        this.setObservableCharacteristics = (unitIndex, categoryName, observableCharacteristics) => {
            this.modifyUnitCategoryInformation(unitIndex, categoryName, category => {
                category["observable_characteristics"] = observableCharacteristics;
            });
        }

        this.setSuggestions = (unitIndex, categoryName, suggestions) => {
            this.modifyUnitCategoryInformation(unitIndex, categoryName, category => {
                category["suggestions"] = suggestions;
            });
        }

        this.setComments = (unitIndex, categoryName, comments) => {
            this.modifyUnitCategoryInformation(unitIndex, categoryName, category => {
                category["comments"] = comments;
            });
        }

        this.getUnitCategoryStatus = (unitId, categoryName) => {
            const unit = this.state.units[unitId];
            const assessmentTask = this.props.navbar.state.chosenAssessmentTask;
            
            return getUnitCategoryStatus(unit, assessmentTask, categoryName);
        }

        this.isUnitCompleteAssessmentComplete = (unitIndex) => {
            return this.state.units[unitIndex].isDone;
        }

        this.findCompletedAssessmentTask = (chosenAssessmentTask, currentUnitTabIndex, completedAssessments) => {
            let foundItem = null;

            completedAssessments.forEach(obj => {
                if (obj["assessment_task_id"] === chosenAssessmentTask && obj["team_id"] === currentUnitTabIndex) {
                    foundItem = obj;
                }
            });

            return foundItem;
        }

        this.generateCategoriesAndSection = () => {
            var rubric = this.props.form.rubric;

            var categoryList = [];

            var section = [];
            
            // We sort rubric["category_json"] by the index of each entry, since the the data gets
            // automatically sorted when it comes out of the backend

            Object.entries(rubric["category_json"])
                .toSorted((a, b) => a[1].index - b[1].index)
                .map(([category, _], index) => {
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

                    if(this.state.currentCategoryTabIndex === index) {
                        section.push(
                            <Section
                                navbar={this.props.navbar}
                                isDone={this.state.units[this.state.currentUnitTabIndex].isDone}
                                category={category}
                                rubric={this.props.form.rubric}
                                currentUnitTabIndex={this.state.currentUnitTabIndex}
                                currentData={this.state.units[this.state.currentUnitTabIndex].rocsData}
                                active={this.state.currentCategoryTabIndex === index}
                                key={index}
                                setSliderValue={this.setSliderValue}
                                setObservableCharacteristics={this.setObservableCharacteristics}
                                setSuggestions={this.setSuggestions}
                                setRatingObservableCharacteristicsSuggestionsJson={this.setRatingObservableCharacteristicsSuggestionsJson}
                                setComments={this.setComments}
                                handleSubmit={this.handleSubmit}
                            />
                        );
                    }

                    return index;
            });

            this.setState({
                categoryList: categoryList,
                section: section
            });
        }
        
        this.areAllCategoriesCompleted = () => {
            const currentUnit = this.state.units[this.state.currentUnitTabIndex];
            
            return currentUnit.categoryNames().every(category => {
                return this.getUnitCategoryStatus(this.state.currentUnitTabIndex, category) === StatusIndicatorState.COMPLETED;
            });
        };
    }

    handleSubmit = (newIsDone) => {
        const state = this.props.navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const chosenCompleteAssessmentTask = state.chosenCompleteAssessmentTask;
        const currentUnitTabIndex = this.state.currentUnitTabIndex;
        const selectedUnit = this.state.units[currentUnitTabIndex];
        const date = new Date();
        
        let promise;
        
        if (chosenCompleteAssessmentTask) {
            chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"] = selectedUnit.rocsData;
            chosenCompleteAssessmentTask["last_update"] = date;
            chosenCompleteAssessmentTask["done"] = newIsDone;
            
            promise = genericResourcePUT(
                `/completed_assessment?completed_assessment_id=${chosenCompleteAssessmentTask["completed_assessment_id"]}`,
                this,
                JSON.stringify(chosenCompleteAssessmentTask),
                { rawResponse: true }
            );
        } else {
            const cookies = new Cookies();
            let route;
            
            if (chosenCompleteAssessmentTask && this.props.userRole) {
                const completedAssessment = this.findCompletedAssessmentTask(chosenAssessmentTask["assessment_task_id"], currentUnitTabIndex, this.props.completedAssessments);
                
                route = `/completed_assessment?completed_assessment_id=${completedAssessment["completed_assessment_id"]}`
            } else {
                if (this.state.unitOfAssessment) {
                    route = `/completed_assessment?team_id=${selectedUnit.id}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
                } else {
                    route = `/completed_assessment?uid=${selectedUnit.id}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
                }
            }
            
            let assessmentData;
            
            if (this.state.unitOfAssessment) { 
                assessmentData = {
                    "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                    "rating_observable_characteristics_suggestions_data": selectedUnit.rocsData,
                    "completed_by": cookies.get("user")["user_id"],
                    "team_id": selectedUnit.id,
                    "user_id": -1,        // team assessment has no user.
                    "initial_time": date,
                    "last_update": date,
                    done: newIsDone,
                };
            } else { 
                assessmentData = {
                    "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                    "rating_observable_characteristics_suggestions_data": selectedUnit.rocsData,
                    "completed_by": cookies.get("user")["user_id"],
                    "team_id": -1,          // individual assessment has no team.
                    "user_id": selectedUnit.id,
                    "initial_time": date,
                    "last_update": date,
                    done: newIsDone,
                };
            }
            
            if (chosenCompleteAssessmentTask && this.props.userRole) {
                promise = genericResourcePUT(route, this, JSON.stringify(assessmentData), { rawResponse: true });
            } else {
                promise = genericResourcePOST(route, this, JSON.stringify(assessmentData), { rawResponse: true });
            }
        }
        
        // Once the CAT entry has been updated, insert the new CAT entry into the unit object
        promise.then(result => {
            const completeAssessmentEntry = result?.["content"]?.["completed_assessments"]?.[0]; // The backend returns a list of a single entry
            
            if (completeAssessmentEntry) {
                this.setState(
                    prevState => {
                        const updatedUnits = [...prevState.units];
        
                        updatedUnits[currentUnitTabIndex] = updatedUnits[currentUnitTabIndex].withNewCAT(completeAssessmentEntry);
                        
                        return { units: updatedUnits };
                    }
                );
            }
        });
        
        // Update the done status of the unit and display saving notification
        this.setState(
            prevState => {
                const updatedUnits = [...prevState.units];

                updatedUnits[currentUnitTabIndex] = updatedUnits[currentUnitTabIndex].withNewIsDone(newIsDone);

                return { 
                    displaySavedNotification: true,
                    units: updatedUnits,
                };
            }
        );
        
        setTimeout(() => {
            this.setState({
                displaySavedNotification: false
            });
        }, 3000);
    };

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
                        <Alert severity={"success"} sx={{ height: "fit-content"}}>Assessment Saved!</Alert>
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
                    {this.props.role_name !== "Student" &&
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
