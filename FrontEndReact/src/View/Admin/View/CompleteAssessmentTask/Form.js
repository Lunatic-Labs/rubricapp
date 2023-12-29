import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section';
import { Box, Tab } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import TeamsTab from './TeamsTab';
import StatusIndicator from './StatusIndicator';

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