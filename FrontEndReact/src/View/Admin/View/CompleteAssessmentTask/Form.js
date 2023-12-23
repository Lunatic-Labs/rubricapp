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
        var initialTeamTab = this.props.form.teams[0]["team_id"];
        this.state = {
            tabCurrentlySelected: 0,
            value : 0,
            teamValue: initialTeamTab,
            currentTeamTab: initialTeamTab,
            teamData : {}
            // Aldo Idea 
            // start an empty object here and create the keys using the teams id/ team names 
            // every key will be an array of values that stores every category for teams. 
            // set a state to be a specific value when team is changed on tab
            // display data regarding that specific team
            // maybe the put and get will be made at this time??
        }
  
        this.handleChange = (event, newValue) => {
            this.setState({
                value: newValue,
            });
        };

        this.handleTeamChange = (event, newValue) => {
            this.setState({
                teamValue: newValue,
            });
        };

        this.handleCategoryChange = (id) => {
            if (this.state.tabCurrentlySelected !== id) {
                this.setState({
                    tabCurrentlySelected: id,
                });
            }
        };

        this.handleTeamTabChange = (id) => {
            if (this.state.currentTeamTab !== id) {
                this.setState({
                    currentTeamTab: id,
                });
            }
        };
    }

    componentDidMount() {
        // Set the keys of users as keys in teamData
        const teamInfoKeys = Object.keys(this.props.form.users);
        const initialTeamData = {};

        teamInfoKeys.forEach((key) => {
            initialTeamData[key] = [];
        });

        this.setState({
            teamData: initialTeamData,
        });
    }

    render() {
        var categoryList = [];
        var section = [];
        var rubric = this.props.form.rubric;

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

            if(this.state.tabCurrentlySelected===index) {
                section.push(
                    <Section
                        navbar={this.props.navbar}
                        category={category}
                        rubric={this.props.form.rubric}
                        active={this.state.tabCurrentlySelected===index}
                        key={index}
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
                                },
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