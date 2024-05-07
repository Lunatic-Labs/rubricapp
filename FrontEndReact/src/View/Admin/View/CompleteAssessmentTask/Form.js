import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section.js';
import { Box, Tab, Button } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import RefreshIcon from '@mui/icons-material/Refresh';
import TeamsTab from './TeamsTab.js';
import StatusIndicator from './StatusIndicator.js';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility.js';
import Cookies from 'universal-cookie';



class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            tabCurrentlySelected: 0,
            teamValue: this.props.form.teams[0]["team_id"],
            currentTeamTab: this.props.form.teams[0]["team_id"],
            teamData: this.props.form.teamInfo,
            categoryList: null,
            section: null
        }

        this.handleTeamChange = (event, newValue) => {
            this.setState({
                    teamValue: newValue,
                    value: 0,
                    tabCurrentlySelected: 0
                },

                this.generateCategoriesAndSection
            );
        };

        this.handleTeamTabChange = (id) => {
            this.setState({
                    currentTeamTab: id,
                    value: 0,
                    tabCurrentlySelected: 0
                },

                this.generateCategoriesAndSection
            );
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

        this.setSliderValue = (teamValue, categoryName, rating) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][categoryName]["rating"] = rating;

                return { teamData: updatedTeamData };
            },

            this.generateCategoriesAndSection
            );
        };

        this.setObservableCharacteristics = (teamValue, categoryName, observableCharacteristics) => {
            if(this.isTeamCompleteAssessmentComplete(teamValue)) return;

            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][categoryName]["observable_characteristics"] = observableCharacteristics;

                return { teamData: updatedTeamData };
            },

            this.generateCategoriesAndSection
            );
        }

        this.setSuggestions = (teamValue, categoryName, suggestions) => {
            if(this.isTeamCompleteAssessmentComplete(teamValue)) return;

            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][categoryName]["suggestions"] = suggestions;

                return { teamData: updatedTeamData };
            },

            this.generateCategoriesAndSection
            );
        }

        this.setComments = (teamValue, categoryName, comments) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][categoryName]["comments"] = comments;

                return { teamData: updatedTeamData };
            },

            this.generateCategoriesAndSection
            );
        }

        this.isCategoryComplete = (teamId, categoryName) => {
            var team = this.state.teamData[teamId];

            var category = team[categoryName];

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

        this.isTeamCompleteAssessmentComplete = (teamId) => {
            return this.state.teamData[teamId]["done"];
        }

        this.findCompletedAssessmentTask = (chosenAssessmentTask, currentTeamTab, completedAssessments) => {
            let foundItem = null;

            completedAssessments.forEach(obj => {
                if (obj["assessment_task_id"] === chosenAssessmentTask && obj["team_id"] === currentTeamTab) {
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
                                status={this.isCategoryComplete(this.state.currentTeamTab, category)}
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

                if(this.state.tabCurrentlySelected === index) {
                    section.push(
                        <Section
                            navbar={this.props.navbar}
                            category={category}
                            rubric={this.props.form.rubric}
                            teamValue={this.state.teamValue}
                            currentData={this.state.teamData[this.state.teamValue]}
                            active={this.state.tabCurrentlySelected===index}
                            key={index}
                            setSliderValue={this.setSliderValue}
                            setObservableCharacteristics={this.setObservableCharacteristics}
                            setSuggestions={this.setSuggestions}
                            setRatingObservableCharacteristicsSuggestionsJson={this.setRatingObservableCharacteristicsSuggestionsJson}
                            setComments={this.setComments}
                            handleSaveForLater={this.handleSaveForLater}
                            handleSubmit={this.handleSubmit}
                            isTeamCompleteAssessmentComplete={this.isTeamCompleteAssessmentComplete}
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

        var currentTeamTab = this.state.currentTeamTab;

        var selected = this.state.teamData[currentTeamTab];

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
                var completedAssessment = this.findCompletedAssessmentTask(chosenAssessmentTask["assessment_task_id"], currentTeamTab, this.props.completedAssessments);

                var completedAssessmentId = `?completed_assessment_id=${completedAssessment["completed_assessment_id"]}`;
            }
            
            var route = this.props.userRole ? `/completed_assessment${completedAssessmentId}` :
            `/completed_assessment?team_id=${currentTeamTab}&assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`;
            
            var assessmentData = {
                "assessment_task_id": chosenAssessmentTask["assessment_task_id"],
                "rating_observable_characteristics_suggestions_data": selected,
                "user_id": cookies.get("user")["user_id"],
                "team_id": currentTeamTab,
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

        Object.keys(this.props.form.teamInfo).map((teamId) => {
            if(this.props.form.teamInfo[teamId]["done"] !== this.state.teamData[teamId]["done"]) {
                rerender = true;
            }

            return teamId;
        });

        if(rerender) {
            this.setState(
                { teamData: this.props.form.teamInfo },
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
                            this.props.refreshTeams();
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
                            <TeamsTab
                                navbar={this.props.navbar}
                                currentTeamTab={this.state.currentTeamTab}
                                teamValue={this.state.teamValue}
                                checkin={this.props.checkin}
                                form={this.props.form}
                                handleTeamChange={this.handleTeamChange}
                                handleTeamTabChange={this.handleTeamTabChange}
                                isTeamCompleteAssessmentComplete={this.isTeamCompleteAssessmentComplete}
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
