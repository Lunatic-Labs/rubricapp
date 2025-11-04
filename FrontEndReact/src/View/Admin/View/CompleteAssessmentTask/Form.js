import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section.js';
import { Box, Tab, Button } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import UnitOfAssessmentTab from './UnitOfAssessmentTab.js';
import StatusIndicator, { StatusIndicatorState } from './StatusIndicator.js';
import { genericResourcePOST, genericResourcePUT, debounce } from '../../../../utility.js';
import Cookies from 'universal-cookie';
import Alert from '@mui/material/Alert';
import { getUnitCategoryStatus } from './cat_utils.js';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch'


/**
 * Creates an instance of the Form component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @param {boolean} props.usingTeams - Boolean indicating whether teams are being used for this form.
 * @param {Array<ATUnit>} props.units - Array of `ATUnit` class objects.
 * @param {Object} props.assessmentTaskRubric - The rubric for the assessment task.
 * @param {Object} props.navbar - The navbar object.
 * @property {int|null} props.jumpId - Id of what team or user to veiw first.
 *  
 * @property {Array<ATUnit>} state.units - Array of `ATUnit` class objects taken from props.units.
 * @property {number} state.currentUnitTabIndex - Index of the currently selected `ATUnit` from `units`.
 * @property {Array<Category>} state.categoryList - Array of `Category` objects using the current rubric.
 * @property {number} state.currentCategoryTabIndex - Index of the currently selected rubric `categoryList`.
 * @property {Object} state.section - Section object of the category `currentCategoryTabIndex` from `categoryList`.
 * @property {boolean} state.displaySavedNotification - Boolean indicating whether to display the pop-up window that confirms the assessment is saved.
 * @property {boolean} state.hideUnits - Boolean indicating if there are tabs that we want to not render.
 * @property {int} state.consistentValidUnit - Int to what tab I want to jump to when swapping between hidden units.
 * @property {Set<number>} unitsThatNeedSaving - A set of all the unit indexes that need saving for autosave.
 */
class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            units: this.props.units,
            currentUnitTabIndex: 0,
            categoryList: null,
            currentCategoryTabIndex: 0,
            section: null,
            displaySavedNotification: false,
            jumpId: this.props.jumpId,
            hideUnits: false,
            consistentValidUnit: 0,
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
                            markForAutosave={this.markForAutosave}
                        />;
                    }
            });

            this.setState({
                categoryList: categoryList,
                section: section, 
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
                
                const completeAssessmentEntry = result?.["content"]?.["completed_assessments"]?.[0];

                if (completeAssessmentEntry) {
                    
                    this.setState(
                        prevState => {
                            const updatedUnits = [...prevState.units];

                            updatedUnits[unitIndex] = updatedUnits[unitIndex].withNewCAT(completeAssessmentEntry);

                            return { units: updatedUnits };
                        }
                    );
                } else {
                    console.error('No CAT returned in response!');
                }
            }).catch(error => {
                console.error('=== SAVE UNIT ERROR ===');
                console.error('Error:', error);
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

        /**
        * @method hideTabs - Handles setting the properties needed for hiding tabs.
        */
        this.hideTabs = (event) => {
            this.setState({
                hideUnits: event.target.checked
            })
            if(event.target.checked && this.state.consistentValidUnit !== null){
                this.handleUnitTabChange(this.state.consistentValidUnit);
            }
        };

        /**
        * @method ensureHiddenTabNotActive - Finds a tab that will not be hidden. 
        *                                       If none, defaults to null.
        */
        this.findPersistantTab = () => {
            const cookies = new Cookies();
            const currentUserId = cookies.get("user")["user_id"];

            for(let index = 0; index < this.state.units.length; ++index){
                let currentUnit = this.state.units[index];
                if (currentUnit["team"]["observer_id"] === currentUserId){
                    return index;
                }

            }
            return null;
        };

        /**
        * @method shouldTabsCategoriesRender - Prevents rendering tabs if TA view has all tabs hidden.
        * 
        * @param {object} - What is supposed to be rendered.
        */
        this.shouldTabsCategoriesRender = (renderObject) => {
            const {hideUnits, consistentValidUnit} = this.state;
            const tabToDefualtTo = consistentValidUnit !== null;
            // {hideUnits} holds precedence.
            return (
                ( (hideUnits && tabToDefualtTo) || (!hideUnits) )
                && renderObject 
            );
        };
    };

    componentDidMount() {
        const {usingTeams, jumpId} = this.props;
        const entity = usingTeams ? 'team': 'user';
        const entityId = usingTeams ? 'team_id': 'user_id';
        if(jumpId !== null){
            for (let index = 0; index < this.state.units.length; index++){
                const unit = this.state.units[index];
                if(unit[entity][entityId] === jumpId){
                    this.setState({
                        currentUnitTabIndex : index,
                    }, () => {
                        this.generateCategoriesAndSection();
                    });
                    break;
                }
            }
        }else{
            this.generateCategoriesAndSection();
        };
        if(this.props.usingTeams){
            this.setState({
                consistentValidUnit: this.findPersistantTab(),
            });
        }
    }
    
    render() {
        return (
            <Box sx={{mt:1}} id="formDiv" className="assessment-task-spacing">
                <Box sx={{
                    display:"flex",
                    justifyContent:"end",
                    gap:"20px",
                    height: "1.5rem",
                }}>
                    { this.state.displaySavedNotification &&
                        <Alert severity={"success"} sx={{ height: "fit-content" }}>Assessment Saved!</Alert>
                    }

                    
                    { this.props.usingTeams && this.props.roleName === "TA/Instructor" &&
                        <FormGroup sx={{ marginTop: "-0.50rem" }}>
                            <FormControlLabel 
                                control={
                                    <Switch 
                                        checked={this.state.hideUnits}
                                        onChange={(event) => this.hideTabs(event)}
                                        sx={{
                                            '& .MuiSwitch-track': {
                                                width: '2.6rem',
                                                height: '1.2rem', 
                                                borderRadius: '0.6rem', 
                                            },
                                            '& .MuiSwitch-thumb': {
                                                width: '1rem',
                                                height: '1rem',
                                                margin: '0.1rem',
                                            },
                                            '& .MuiSwitch-switchBase': {
                                                 top: '0.17rem',
                                            },
                                        }}  
                                    />
                                } 
                                label={"MY TEAMS"}
                            />
                        </FormGroup>
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
                                checkins={this.props.checkins}
                                handleUnitTabChange={this.handleUnitTabChange}
                                hideUnits={this.state.hideUnits}
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
                            {this.shouldTabsCategoriesRender(this.state.categoryList)}
                        </Tabs>
                    </Box>
                </Box>

                {this.shouldTabsCategoriesRender(this.state.section)}
            </Box>
        )
    }
}

export default Form;
