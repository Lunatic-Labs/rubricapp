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
    }
    render() {
        const data = this.props.data;
        const recordList = [];
        data["category"].map((record) => {return recordList.push(record)})
        var categories = [];
        var sections = [];
        const changeCategory = (id) => {
            if(this.state.tabCurrentlySelected!==id) {
                this.setState({
                    tabCurrentlySelected: id
                });
            }
        }
        for(var i = 0; i < data["category"].length; i++) {
            var currentCategory = data["category"][i];
            var categoryName = currentCategory["name"];
            categories.push(<Category name={categoryName} active={this.state.tabCurrentlySelected===i} id={i} changeCategory={changeCategory} key={i}/>);
            if(this.state.tabCurrentlySelected===i) {
                sections.push(<Section section={currentCategory["section"]} key={i}/>);
            }
        }
        return (
            <React.Fragment>
                <div className=" container mt-4">
                    <ul className="d-flex gap-3 m-3 nav nav-tabs" style={{"borderBottom":"none"}}>
                        {categories}
                    </ul>
                    <div className="tab-content">
                        {sections}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Form;