import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section';
import { Box, Tab } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import TeamsTab from './TeamsTab';
import StatusIndicator from './StatusIndicator';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';
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

        this.setSliderValue = (teamValue, category_name, rating) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["rating"] = rating;

                return { teamData: updatedTeamData };
            },
            this.generateCategoriesAndSection
            );
        };

        this.setObservable_characteristics = (teamValue, category_name, observable_characteristics) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["observable_characteristics"] = observable_characteristics;

                return { teamData: updatedTeamData };
            },
            this.generateCategoriesAndSection
            );
        }

        this.setSuggestions = (teamValue, category_name, suggestions) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["suggestions"] = suggestions;

                return { teamData: updatedTeamData };
            },
            this.generateCategoriesAndSection
            );
        }

        this.setComments = (teamValue, category_name, comments) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["comments"] = comments;

                return { teamData: updatedTeamData };
            },
            this.generateCategoriesAndSection
            );
        }

        this.isCategoryComplete = (team_id, category_name) => {
            var team = this.state.teamData[team_id];
            var category = team[category_name];

            var ratingStatus = category["rating"] !== 0;
            var observableCharacteristic = category["observable_characteristics"].includes("1");
            var suggestions = category["suggestions"].includes("1");

            var status = null;

            if(ratingStatus && observableCharacteristic && suggestions) {
                status = true;
            } else if (ratingStatus || observableCharacteristic || suggestions) {
                status = false;
            }

            return status;
        }

        this.isTeamCompleteAssessmentComplete = (team_id) => {
            return this.state.teamData[team_id]["done"];
        }

        this.generateCategoriesAndSection = () => {
            var rubric = this.props.form.rubric;
            var categoryList = [];
            var section = [];

            Object.keys(rubric["category_json"]).map((category, index) => {
                categoryList.push(
                    <Tab label={
                        <Box sx={{ display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
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
                            setObservable_characteristics={this.setObservable_characteristics}
                            setSuggestions={this.setSuggestions}
                            setRatingObservableCharacteristicsSuggestionsJson={this.setRatingObservableCharacteristicsSuggestionsJson}
                            setComments={this.setComments}
                            handleSaveForLater={this.handleSaveForLater}
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
    }

    handleSubmit = (done) => {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;

        var currentTeamTab = this.state.currentTeamTab;
        var selected = this.state.teamData[currentTeamTab];

        // TODO: When an admin selects a completed assessment to view, it should display the corresponding team selected and only do PUT!
        // TODO: when the admin selects a completed assessment to view, but they switch teams, it should do a POST instead of the PUT!

        if(chosen_complete_assessment_task) {
            chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = selected;
            chosen_complete_assessment_task["team_id"] = currentTeamTab;
            chosen_complete_assessment_task["done"] = done;

            genericResourcePUT(
                `/completed_assessment?completed_assessment_id=${chosen_complete_assessment_task["completed_assesesment_id"]}`,
                this,
                chosen_complete_assessment_task
            );
        } else {
            var cookies = new Cookies();
            var date = new Date();

            genericResourcePOST(
                `/completed_assessment?team_id=${currentTeamTab}&assessment_task_id=${chosen_assessment_task["assessment_task_id"]}`,
                this,
                JSON.stringify({
                    assessment_task_id: chosen_assessment_task["assessment_task_id"],
                    rating_observable_characteristics_suggestions_data: selected,
                    user_id: cookies.get("user")["user_id"],
                    team_id: currentTeamTab,
                    initial_time: date,
                    last_update: date,
                    done: done,
                })
            )
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

        Object.keys(this.props.form.teamInfo).map((team_id) => {
            if(this.props.form.teamInfo[team_id]["done"] !== this.state.teamData[team_id]["done"]) {
                rerender = true;
            }
            return team_id;
        });

        if(rerender) {
            this.setState({
                teamData: this.props.form.teamInfo
            },
            this.generateCategoriesAndSection
            );
        }
    }

    render() {
        return (
            <Box sx={{mt:2}} id="formDiv" className="assessment-task-spacing">
                <Box>
                    <Box sx={{pb: 1}} className="content-spacing">
                        <TeamsTab
                            navbar={this.props.navbar}
                            currentTeamTab={this.state.currentTeamTab}
                            teamValue={this.state.teamValue}
                            form={this.props.form}
                            handleTeamChange={this.handleTeamChange}
                            handleTeamTabChange={this.handleTeamTabChange}
                            isTeamCompleteAssessmentComplete={this.isTeamCompleteAssessmentComplete}
                        />
                    </Box>

                    <Box sx={{mt: 2}}>
                        <Tabs
                            value={this.state.value} 
                            onChange={(event, newValue) => {
                                this.handleChange(event, newValue);
                                this.handleCategoryChange(newValue);
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
