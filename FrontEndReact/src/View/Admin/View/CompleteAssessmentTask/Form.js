import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Category from './Category';
import Section from './Section';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabCurrentlySelected: 0,
        }
        this.changeCategory = (id) => {
            if(this.state.tabCurrentlySelected!==id) {
                this.setState({
                    tabCurrentlySelected: id,
                });
            }
        }
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
            navbar.categoryComponent.active = this.state.tabCurrentlySelected===i;
            navbar.categoryComponent.id = i;
            navbar.categoryComponent.changeCategory = this.changeCategory;

            categoryList.push(
                <Category
                    navbar={navbar}
                    key={i}
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
                <div id="formDiv" className="container mt-4">
                    <ul className="d-flex gap-1 nav nav-tabs" style={{"borderBottom":"none"}}>
                        {categoryList}
                    </ul>
                    <div className="tab-content">
                        {section}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Form;