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
        const categories = this.props.data;
        var categoryList = [];
        var section = [];
        for(var i = 0; i < categories.length; i++) {
            var currentCategory = categories[i];
            var categoryName = currentCategory["category_name"];
            categoryList.push(
                <Category
                    name={categoryName}
                    active={this.state.tabCurrentlySelected===i}
                    id={i}
                    changeCategory={this.changeCategory}
                    key={i}
                />
            );
            if(this.state.tabCurrentlySelected===i) {
                section.push(
                    <Section
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
                        setNewTab={this.props.setNewTab}
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