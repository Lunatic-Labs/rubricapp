import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section.js';
import { Box, Tab, Button } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import RefreshIcon from '@mui/icons-material/Refresh';
import UnitOfAssessmentTab from './UnitOfAssessmentTab.js';
import StatusIndicator from './StatusIndicator.js';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import Cookies from 'universal-cookie';

// Form component is used to display the form for the assessment task.  
// It is used in the CompleteAssessmentTask component.
// It needs to know if this is a team or individual assessment task, the rubric, the units, 
// the users, the unit of assessment, the roles, the completed assessments, and the checkin.
// It uses the Section component to display the sections of the form.
// It uses the UnitOfAssessmentTab component to display the tabs for the individuals or teams.

class Form extends Component {
    constructor(props) {
        super(props);
        console.log(this.props);
        this.state = {
            value: 0,
            tabCurrentlySelected: 0,
            unitOfAssessment: this.props.unitOfAssessment,
            unitId: this.props.unitOfAssessment ? "team_id" : "user_id",
            unitValue: this.props.unitOfAssessment ? this.props.form.units[0]["team_id"] : 
                                                     this.props.form.units[0]["user_id"], 
            currentUnitTab: this.props.unitOfAssessment ? this.props.form.units[0]["team_id"] : 
                                                          this.props.form.units[0]["user_id"], 
            unitData: this.props.form.unitInfo,
            categoryList: null,
            section: null
        }
        console.log(this.state);

        this.handleUnitChange = (event, newValue) => {
            this.setState({
                    UnitValue: newValue,
                    value: 0,
                    tabCurrentlySelected: 0
                },

                this.generateCategoriesAndSection
            );
            console.log("handleUnitChange:",this.state.value);
        };

        this.handleUnitTabChange = (id) => {
            this.setState({
                    currentUnitTab: id,
                    value: 0,
                    tabCurrentlySelected: 0
                },

                this.generateCategoriesAndSection
            );
            console.log("handleUnitTabChange:",this.state.value);
        };

        this.handleChange = (event, newValue) => {
            this.setState({
                    value: newValue,
                },

                this.generateCategoriesAndSection
            );
        };

        this.handleCategoryChange = (id) => {
            if (this.state.tabCurrentlySelected !== id) {
                this.setState({
                        tabCurrentlySelected: id
                    },

                    this.generateCategoriesAndSection
                );
            }
            console.log("handleCategoryChange:",this.state.value);
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

        this.setSliderValue = (UnitValue, categoryName, rating) => {
            this.setState(prevState => {
                const updatedUnitData = this.deepClone(prevState.unitData);

                updatedUnitData[UnitValue][categoryName]["rating"] = rating;

                return { unitData: updatedUnitData };
            },

            this.generateCategoriesAndSection
            );
        };

        this.setObservableCharacteristics = (unitValue, categoryName, observableCharacteristics) => {
            if(this.isUnitCompleteAssessmentComplete(unitValue)) return;

            this.setState(prevState => {
                const updatedUnitData = this.deepClone(prevState.unitData);

                updatedUnitData[unitValue][categoryName]["observable_characteristics"] = observableCharacteristics;

                return { unitData: updatedUnitData };
            },

            this.generateCategoriesAndSection
            );
            console.log("setObservableCharacteristics:",this.state.value);
        }

        this.setSuggestions = (unitValue, categoryName, suggestions) => {
            if(this.isUnitCompleteAssessmentComplete(unitValue)) return;

            this.setState(prevState => {
                const updatedUnitData = this.deepClone(prevState.unitData);

                updatedUnitData[unitValue][categoryName]["suggestions"] = suggestions;

                return { unitData: updatedUnitData };
            },

            this.generateCategoriesAndSection
            );
            console.log("setSuggestions:",this.state.value);
        }

        this.setComments = (UnitValue, categoryName, comments) => {
            this.setState(prevState => {
                const updatedUnitData = this.deepClone(prevState.unitData);

                updatedUnitData[UnitValue][categoryName]["comments"] = comments;

                return { unitData: updatedUnitData };
            },

            this.generateCategoriesAndSection
            );
            console.log("setComments:",this.state.value);
        }

        this.isCategoryComplete = (unitId, categoryName) => {
            var unit = this.state.unitData[unitId];

            var category = unit[categoryName];

            var observableCharacteristic = category["observable_characteristics"].includes("1");

            var suggestions = category["suggestions"].includes("1");

            var status = null;

            if(observableCharacteristic && suggestions) {
                status = true;

            } else if (observableCharacteristic || suggestions) {
                status = false;
            }

            return status;
        }

        this.isUnitCompleteAssessmentComplete = (unitId) => {
            return this.state.unitData[unitId]["done"];
        }

        this.findCompletedAssessmentTask = (chosenAssessmentTask, currentUnitTab, completedAssessments) => {
            let foundItem = null;

            completedAssessments.forEach(obj => {
                if (obj["assessment_task_id"] === chosenAssessmentTask && obj["team_id"] === currentUnitTab) {
                    foundItem = obj;
                }
            });

            return foundItem;
        }

        this.generateCategoriesAndSection = () => {
            var rubric = this.props.form.rubric;

            var categoryList = [];

            var section = [];

            Object.keys(rubric["category_json"]).map((category, index) => {
                categoryList.push(
                    <Tab label={
                        <Box sx={{ display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center", maxHeight: 10}}>
                            <span>{category}</span>

                            <StatusIndicator
                                status={this.isCategoryComplete(this.state.currentUnitTab, category)}
                            />
                        </Box>
                    }

                    value={index} key={index}

                    sx={{
                        minWidth: 170,
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.state.tabCurrentlySelected === index ? '2px solid #2E8BEF ' : '2px solid gray',
                        '&.Mui-selected': { color: '#2E8BEF ' }
                    }}/>
                );
                console.log("generateCategoriesandSections:",index);

                if(this.state.tabCurrentlySelected === index) {
                    section.push(
                        <Section
                            navbar={this.props.navbar}
                            category={category}
                            rubric={this.props.form.rubric}
                            unitValue={this.state.unitValue}
                            currentData={this.state.unitData[this.state.unitValue]}
                            active={this.state.tabCurrentlySelected===index}
                            key={index}
                            setSliderValue={this.setSliderValue}
                            setObservableCharacteristics={this.setObservableCharacteristics}
                            setSuggestions={this.setSuggestions}
                            setRatingObservableCharacteristicsSuggestionsJson={this.setRatingObservableCharacteristicsSuggestionsJson}
                            setComments={this.setComments}
                            handleSaveForLater={this.handleSaveForLater}
                            handleSubmit={this.handleSubmit}
                            isUnitCompleteAssessmentComplete={this.isUnitCompleteAssessmentComplete}
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
    }

    handleSubmit = (done) => {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCompleteAssessmentTask = state.chosenCompleteAssessmentTask;

        var currentUnitTab = this.state.currentUnitTab;

        var selected = this.state.unitData[currentUnitTab];

        var date = new Date();

        if(chosenCompleteAssessmentTask) {
            chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"] = selected;

            chosenCompleteAssessmentTask["last_update"] = date;

            chosenCompleteAssessmentTask["done"] = done;

            genericResourcePUT(
                `/completed_assessment?completed_assessment_id=${chosenCompleteAssessmentTask["completed_assessment_id"]}`,
                this,
                JSON.stringify(chosenCompleteAssessmentTask)
            );

        } else {
            var cookies = new Cookies();

            if(this.props.userRole) {
                var completedAssessment = this.findCompletedAssessmentTask(chosenAssessmentTask["assessment_task_id"], currentUnitTab, this.props.completedAssessments);

                var completedAssessmentId = `?completed_assessment_id=${completedAssessment["completed_assessment_id"]}`;
            }
            
            var route = this.props.userRole ? `/completed_assessment${completedAssessmentId}` :
            `/completed_assessment?team_id=${currentUnitTab}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
            
            var assessmentData = {
                "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                "rating_observable_characteristics_suggestions_data": selected,
                "completed_by": cookies.get("user")["user_id"],
                "team_id": currentUnitTab,
                "initial_time": date,
                "last_update": date,
                done: done,
            };
            
            if (this.props.userRole) {
                genericResourcePUT(route, this, JSON.stringify(assessmentData));

            } else {
                genericResourcePOST(route, this, JSON.stringify(assessmentData));
            }
        }

        setTimeout(() => {
            this.props.handleDone();
        }, 1000);
    };

    componentDidMount() {
        this.generateCategoriesAndSection();
    }

    componentDidUpdate() {
        var rerender = false;

        Object.keys(this.props.form.unitInfo).map((unitId) => {
            if(this.props.form.unitInfo[unitId]["done"] !== this.state.unitData[unitId]["done"]) {
                rerender = true;
            }

            return unitId;
        });

        if(rerender) {
            this.setState(
                { unitData: this.props.form.unitInfo },
                this.generateCategoriesAndSection
            );
        }
    }

    render() {
        return (
            <Box sx={{mt:2}} id="formDiv" className="assessment-task-spacing">
                <Box sx={{
                    display:"flex",
                    justifyContent:"end",
                    gap:"20px"
                }}>
                     <Button
                        variant="text"
                        color="primary"
                        startIcon={<RefreshIcon />}

                        onClick={() => {
                            this.props.refreshunits();
                        }}
                    >
                        Refresh
                    </Button>

                    <Button
                        id="formSubmitButton"
                        variant="contained"
                        color="primary"

                        onClick={() => {
                            this.handleSubmit(true);
                        }}
                    >
                        Save
                    </Button>
                </Box>

                <Box>
                    {this.props.role_name !== "Student" &&
                        <Box sx={{pb: 1}} className="content-spacing">
                            <UnitOfAssessmentTab
                                navbar={this.props.navbar}
                                currentUnitTab={this.state.currentUnitTab}
                                unitValue={this.state.unitValue}
                                checkin={this.props.checkin}
                                form={this.props.form}
                                handleUnitChange={this.handleUnitChange}
                                handleUnitTabChange={this.handleUnitTabChange}
                                isUnitCompleteAssessmentComplete={this.isUnitCompleteAssessmentComplete}
                            />
                        </Box>
                    }

                    <Box sx={{mt: 2}}>
                        <Tabs
                            value={this.state.value} 
                        
                            onChange={(event, newValue) => {
                                this.handleChange(event, newValue);
                                this.handleCategoryChange(newValue);
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
                                }
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
