import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import Section from './Section';
import { Box, Tab } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabCurrentlySelected: 0,
            value : 0,
        }

  
        this.handleChange = (event, newValue) => {
            this.setState({
                value: newValue,
            });
        };

        this.handleCategoryChange = (id) => {
            if (this.state.tabCurrentlySelected !== id) {
                this.setState({
                    tabCurrentlySelected: id,
                });
            }
        };
    }
    render() {
        var navbar = this.props.navbar;
        navbar.form = {};
        navbar.form.autoSave = this.autoSave;

        var completeAssessmentTask = navbar.completeAssessmentTask;
        var rubrics = completeAssessmentTask.rubrics;
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
                    label={categoryName}
                    value={i}
                    key={i}
                    sx={{ minWidth: 170,
                        padding: "",
                        borderRadius: "10px",
                        margin : "0 0px 0 10px",
                        border: this.state.tabCurrentlySelected === i ? '2px solid #2196F3' : '2px solid gray',
                        ['&.Mui-selected']: {
                            color: '#2196F3'
                        },
                    }}
                />
            );

            if(this.state.tabCurrentlySelected===i) {
                navbar.form.section = currentCategory;
                navbar.form.active = this.state.tabCurrentlySelected===i;
                section.push(
                    <Section
                        navbar={navbar}
                        key={i}
                    />
                )
            }
        }

        return (
            
            <React.Fragment>
                <Box id="formDiv" className="assessment-task-spacing">
                    <Box>
                        <Tabs
                        value={this.state.value} 
                        onChange={this.handleChange}
                        onClick={this.handleCategoryChange(this.state.value)}
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
                    <div className="tab-content">
                        {section}
                    </div>
                    
                </Box>
            </React.Fragment>
        )
    }
}

export default Form;