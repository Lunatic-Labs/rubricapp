import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section.js';
import { Box, Tab, Button } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import UnitOfAssessmentTab from './UnitOfAssessmentTab.js';
import StatusIndicator, { StatusIndicatorState } from './StatusIndicator.js';
<<<<<<< HEAD
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
=======
import { genericResourcePOST, genericResourcePUT, debounce } from '../../../../utility.js';
>>>>>>> master
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
 * @property {Array<ATUnit>} state.units - Array of `ATUnit` class objects taken from props.units.
 * @property {number} state.currentUnitTabIndex - Index of the currently selected `ATUnit` from `units`.
 * @property {Array<Category>} state.categoryList - Array of `Category` objects using the current rubric.
 * @property {number} state.currentCategoryTabIndex - Index of the currently selected rubric `categoryList`.
 * @property {Object} state.section - Section object of the category `currentCategoryTabIndex` from `categoryList`.
 * @property {boolean} state.displaySavedNotification - Boolean indicating whether to display the pop-up window that confirms the assessment is saved.
 * 
 * @property {Set<number>} unitsThatNeedSaving - A set of all the unit indexes that need saving for autosave.
 */
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
<<<<<<< HEAD
            unitOfAssessment: this.props.unitOfAssessment,
            units: this.props.form.units,
=======
            units: this.props.units,
>>>>>>> master
            currentUnitTabIndex: 0,
            categoryList: null,
            currentCategoryTabIndex: 0,
            section: null,
<<<<<<< HEAD
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
=======
            displaySavedNotification: false,
        };
        
        this.unitsThatNeedSaving = new Set();

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
>>>>>>> master
                    },
                    () => {
                        this.generateCategoriesAndSection();
                    }
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
                    () => {
                        this.generateCategoriesAndSection();
                    }
                );
            }
<<<<<<< HEAD
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
=======
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
>>>>>>> master
            
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

<<<<<<< HEAD
                    if(this.state.currentCategoryTabIndex === index) {
                        section.push(
                            <Section
                                navbar={this.props.navbar}
                                isDone={this.state.units[this.state.currentUnitTabIndex].isDone}
                                category={category}
                                rubric={this.props.form.rubric}
                                currentUnitTabIndex={this.state.currentUnitTabIndex}
                                currentData={this.state.units[this.state.currentUnitTabIndex].rocsData}
                                active={this.state.currentCategoryTabIndex===index}
                                key={index}
                                setSliderValue={this.setSliderValue}
                                setObservableCharacteristics={this.setObservableCharacteristics}
                                setSuggestions={this.setSuggestions}
                                setRatingObservableCharacteristicsSuggestionsJson={this.setRatingObservableCharacteristicsSuggestionsJson}
                                setComments={this.setComments}
                                handleSubmit={this.handleSubmit}
                            />
                        );
=======
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
                            markForAutosave={this.markForAutosave}
                        />;
>>>>>>> master
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
<<<<<<< HEAD
            });
        };
    }

    handleSubmit = (done) => {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCompleteAssessmentTask = state.chosenCompleteAssessmentTask;

        var currentUnitTabIndex = this.state.currentUnitTabIndex;

        var selected = this.state.units[currentUnitTabIndex];

        var date = new Date();
        if(chosenCompleteAssessmentTask) {
            chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"] = selected.rocsData;

            chosenCompleteAssessmentTask["last_update"] = date;

            chosenCompleteAssessmentTask["done"] = selected.isdone;
            genericResourcePUT(
                `/completed_assessment?completed_assessment_id=${chosenCompleteAssessmentTask["completed_assessment_id"]}`,
                this,
                JSON.stringify(chosenCompleteAssessmentTask)
            );

        } else {
            var cookies = new Cookies();
            var route="";
            if(chosenCompleteAssessmentTask && this.props.userRole) {
                var completedAssessment = this.findCompletedAssessmentTask(chosenAssessmentTask["assessment_task_id"], currentUnitTabIndex, this.props.completedAssessments);

                var completedAssessmentId = `?completed_assessment_id=${completedAssessment["completed_assessment_id"]}`;
                
                route = `/completed_assessment${completedAssessmentId}`
            } else {
                if (this.state.unitOfAssessment) {
                    route = `/completed_assessment?team_id=${selected.id}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
                } else {
                    route = `/completed_assessment?uid=${selected.id}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
                }
            }
            var assessmentData = {};
            if (this.state.unitOfAssessment) { 
                assessmentData = {
                    "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                    "rating_observable_characteristics_suggestions_data": selected.rocsData,
                    "completed_by": cookies.get("user")["user_id"],
                    "team_id": selected.id,
                    "user_id": -1,        // team assessment has no user.
                    "initial_time": date,
                    "last_update": date,
                    done: done,
                };
            } else { 
                assessmentData = {
                    "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                    "rating_observable_characteristics_suggestions_data": selected.rocsData,
                    "completed_by": cookies.get("user")["user_id"],
                    "team_id": -1,          // individual assessment has no team.
                    "user_id": selected.id,
                    "initial_time": date,
                    "last_update": date,
                    done: done,
                };
            }  
            if (chosenCompleteAssessmentTask && this.props.userRole) {
                genericResourcePUT(route, this, JSON.stringify(assessmentData));

            } else {
                genericResourcePOST(route, this, JSON.stringify(assessmentData));
            }
        }

        this.setState(
            prevState => {
                const updatedUnits = [...prevState.units];

                updatedUnits[currentUnitTabIndex] = updatedUnits[currentUnitTabIndex].withNewIsDone(done);

                return { 
                    displaySavedNotification: true,
                    units: updatedUnits 
                };
            }
        );

        setTimeout(() => {
            this.props.handleDone();
        }, 1000);

        setTimeout(() => {
            this.setState({
                displaySavedNotification: false
=======
>>>>>>> master
            });
        };
        
        /**
         * 
         * @method saveUnit - Saves a unit to the server.
         * @param {number} unitIndex - The index of the unit to save.
         * @param {boolean} markDone - If the unit should be marked as done or retain the current done status.
         */
        this.saveUnit = (unitIndex, markDone) => {
            const chosenAssessmentTaskId = this.props.navbar.state.chosenAssessmentTask["assessment_task_id"];
            const unit = this.state.units[unitIndex];
            
            const cookies = new Cookies();
            const currentUserId = cookies.get("user")["user_id"];
            const currentDate = new Date();
            
            // If markDone then mark the unit as done, otherwise use the original done status.
            const newIsDone = markDone ? true : unit.isDone;
            
            const newUnit = unit.withNewIsDone(newIsDone);
            const newCAT = newUnit.generateNewCAT(chosenAssessmentTaskId, currentUserId, currentDate);
            
            let promise;
            
            if (unit.completedAssessmentTask) {
                const catId = unit.completedAssessmentTask["completed_assessment_id"];
                
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
                    
                    updatedUnits[unitIndex] = newUnit;
    
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

                            updatedUnits[unitIndex] = updatedUnits[unitIndex].withNewCAT(completeAssessmentEntry);

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
        
        /**
         * @method markForAutosave - Marks a unit to be autosaving soon.
         * @param {number} unitIndex - The index of the unit.
         */
        this.markForAutosave = (unitIndex) => {
            this.unitsThatNeedSaving.add(unitIndex);
            
            this.doAutosave();
        }
        
        /**
         * @method doAutosave - Performs an autosave.
         */
        this.doAutosave = debounce(() => {
            this.unitsThatNeedSaving.forEach(unitIndex => {
                this.saveUnit(unitIndex, false);
            });
            
            this.unitsThatNeedSaving.clear();
        }, 2000);
    }

    componentDidMount() {
        this.generateCategoriesAndSection();
    }
<<<<<<< HEAD

    componentDidUpdate() {
        var rerender = false;

        Object.keys(this.props.form.units).map((unitIndex) => {
            if(this.props.form.units[unitIndex].isDone !== this.state.units[unitIndex].isDone) {
                rerender = true;
            }

            return unitIndex;
        });

        if(rerender) {
            this.setState(
                { unitData: this.props.form.unitInfo },
                this.generateCategoriesAndSection
            );
        }
    }

=======
    
>>>>>>> master
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
                                this.saveUnit(this.state.currentUnitTabIndex, this.areAllCategoriesCompleted());
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
<<<<<<< HEAD
=======
                                checkins={this.props.checkins}
>>>>>>> master
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
