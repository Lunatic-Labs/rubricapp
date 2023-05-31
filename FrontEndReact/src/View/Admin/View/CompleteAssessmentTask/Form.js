import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Category from './Category';
import Section from './Section';

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabCurrentlySelected: 0
        }
        this.changeCategory = (id) => {
            if(this.state.tabCurrentlySelected!==id) {
                this.setState({
                    tabCurrentlySelected: id
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
            var categoryName = currentCategory["name"];
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
                        section={currentCategory}
                        active={this.state.tabCurrentlySelected===i}
                        key={i}
                        readOnly={this.props.readOnly}
                    />
                )
            }
        }
        return (
            <React.Fragment>
                <div className="container mt-4">
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