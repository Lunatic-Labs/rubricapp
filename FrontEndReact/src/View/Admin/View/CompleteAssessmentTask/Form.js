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
        var initialTeamTab = this.props.navbar.completeAssessmentTask.teams[0]["team_id"];
        this.state = {
            tabCurrentlySelected: 0,
            value : 0,
            teamValue: initialTeamTab,
            currentTeamTab: initialTeamTab,
            teamData : {},
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
        // Set the keys of teamInfo as keys in teamData
        const teamInfoKeys = Object.keys(this.props.navbar.completeAssessmentTask.teamInfo);
        const initialTeamData = {};

        teamInfoKeys.forEach((key) => {
            initialTeamData[key] = [];
        });

        this.setState({
            teamData: initialTeamData,
        });
    }

    render() {
        
        var navbar = this.props.navbar;
        navbar.form = {};
        navbar.form.autoSave = this.autoSave;

        var completeAssessmentTask = navbar.completeAssessmentTask;
        var rubrics = completeAssessmentTask.rubrics;
        var teamInfo = completeAssessmentTask.teamInfo;

        const categories = rubrics["categories"];

        navbar.form.total_categories = categories.length;

        var state = navbar.state;
        var chosen_assessment_task = state.chosen_assessment_task;

        navbar.form.show_ratings = chosen_assessment_task ? chosen_assessment_task["show_ratings"] : true;
        navbar.form.show_suggestions = chosen_assessment_task ? chosen_assessment_task["show_suggestions"] : true;
        navbar.form.total_observable_characteristics = rubrics["total_observable_characteristics"];
        navbar.form.total_suggestions = rubrics["total_suggestions"];
        navbar.form.category_rating_observable_characteristics_suggestions_json = rubrics["category_rating_observable_characteristics_suggestions_json"];
        navbar.form.category_json = rubrics["category_json"];

        var categoryList = [];
        var section = [];

        for(var i = 0; i < categories.length; i++) {
            var currentCategory = categories[i];
            var categoryName = currentCategory["category_name"];

            navbar.categoryComponent = {};
            navbar.categoryComponent.name = categoryName;
            navbar.categoryComponent.active = this.state.tabCurrentlySelected === i;
            navbar.categoryComponent.id = i;
            navbar.categoryComponent.changeCategory = this.handleCategoryChange;

            categoryList.push(
                <Tab
                    label={
                    <Box sx={{
                        display:"flex", 
                        flexDirection:"row", 
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <span>{categoryName}</span>
                        <StatusIndicator status='inProgress'/>
                    </Box>
                    }
                    value={i}
                    key={i}
                    sx={{
                        minWidth: 170,
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.state.tabCurrentlySelected === i ? '2px solid #2E8BEF ' : '2px solid gray',
                        '&.Mui-selected': {
                            color: '#2E8BEF '
                        },
                    }}
                />
            );

            if(this.state.tabCurrentlySelected===i) {
                navbar.form.section = currentCategory;
                navbar.form.active = this.state.tabCurrentlySelected===i;
                section.push(
                    <Section
                        navbar={this.props.navbar}
                        autoSave={this.autoSave}
                        section={currentCategory}
                        total_categories={categories.length}
                        active={this.state.tabCurrentlySelected===i}
                        key={i}
                        chosen_complete_assessment_task={this.props.chosen_complete_assessment_task}
                        show_ratings={this.props.show_ratings}
                        show_suggestions={this.props.show_suggestions}
                        readOnly={this.props.readOnly}
                        total_observable_characteristics={this.props.total_observable_characteristics}
                        total_suggestions={this.props.total_suggestions}
                        category_rating_observable_characteristics_suggestions_json={this.props.category_rating_observable_characteristics_suggestions_json}
                        category_json={this.props.category_json}
                    />
                )
            }
        }

        return (
            
            <React.Fragment>
                <Box sx={{mt:2}} id="formDiv" className="assessment-task-spacing">
                    <Box>
                        <Box sx={{pb: 1}} className="content-spacing">
                            <TeamsTab
                                navbar={navbar}
                                currentTeamTab={this.state.currentTeamTab}
                                teamValue={this.state.teamValue}
                                teamInfo={teamInfo}
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
                    <div className="">
                        {section}
                    </div>
                    
                </Box>
            </React.Fragment>
        )
    }
}

export default Form;