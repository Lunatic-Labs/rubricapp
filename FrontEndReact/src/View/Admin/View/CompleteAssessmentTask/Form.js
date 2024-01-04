import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section';
import { Box, Tab } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import TeamsTab from './TeamsTab';
import StatusIndicator from './StatusIndicator';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';

class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 0,
            tabCurrentlySelected: 0,
            teamValue: this.props.form.teams[0]["team_id"],
            currentTeamTab: this.props.form.teams[0]["team_id"],
            teamData: this.props.form.teamInfo
        }

        this.handleTeamChange = (event, newValue) => {
            this.setState({
                teamValue: newValue,
                value: 0,
                tabCurrentlySelected: 0
            });
        };

        this.handleTeamTabChange = (id) => {
            this.setState({
                currentTeamTab: id,
                value: 0,
                tabCurrentlySelected: 0
            });
        };

        this.handleChange = (event, newValue) => {
            this.setState({
                value: newValue,
            });
        };

        this.handleCategoryChange = (id) => {
            if (this.state.tabCurrentlySelected !== id) {
                this.setState({
                    tabCurrentlySelected: id
                });
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
            });
        };

        this.setObservable_characteristics = (teamValue, category_name, observable_characteristics) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["observable_characteristics"] = observable_characteristics;

                return { teamData: updatedTeamData };
            });
        }

        this.setSuggestions = (teamValue, category_name, suggestions) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["suggestions"] = suggestions;

                return { teamData: updatedTeamData };
            });
        }

        this.setComments = (teamValue, category_name, comments) => {
            this.setState(prevState => {
                const updatedTeamData = this.deepClone(prevState.teamData);

                updatedTeamData[teamValue][category_name]["comments"] = comments;

                return { teamData: updatedTeamData };
            });
        }
    }

    handleSubmit = () => {
        var navbar = this.props.navbar;
        var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
        var state = navbar.state;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var readOnly = completeAssessmentTaskReadOnly.readOnly;
        var currentTeamTab = this.state.currentTeamTab
        var teamData = this.state.teamData[currentTeamTab];

    
            chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.teamData[currentTeamTab];
            genericResourcePOST(`/completed_assessment?assessment_task_id=${chosen_complete_assessment_task.assessment_task_id}&team_id=${currentTeamTab}&user_id=${chosen_complete_assessment_task.user_id}`, 
                this, JSON.stringify(chosen_complete_assessment_task));

    
        // if (navbar.state.addCourse)
        //     genericResourcePOST("/course", this, body);
        // else
        //     genericResourcePUT(`/course?course_id=${navbar.state.course["course_id"]}`, this, body);
        // confirmCreateResource("Course");
    };

    handleSaveForLater = () => {
        // Fetch logic for saving for later
        const currentTeamTab = this.state.currentTeamTab;

        // Include currentTeamTab in your fetch request
        // Example:
        fetch('your-save-for-later-api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                teamTab: currentTeamTab,
                // Include other data as needed
            }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response
            console.log('Save for Later Response:', data);
        })
        .catch(error => {
            console.error('Error saving for later:', error);
        });
    };

    render() { 
        
        var rubric = this.props.form.rubric;
        var categoryList = [];
        var section = [];

        Object.keys(rubric["category_json"]).map((category, index) => {
            categoryList.push(
                <Tab label={
                    <Box sx={{ display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "center"}}>
                        <span>{category}</span>
                        <StatusIndicator status='inProgress'/>
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
                            {categoryList}
                        </Tabs>
                    </Box>
                </Box>
                {section}
            </Box>
        )
    }
}

export default Form;