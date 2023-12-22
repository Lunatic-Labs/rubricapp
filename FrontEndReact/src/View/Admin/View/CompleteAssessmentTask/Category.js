import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Category extends Component {
    render() {
        var navbar = this.props.navbar;
        var categoryComponent = navbar.categoryComponent;
        var name = categoryComponent.name;
        var active = categoryComponent.active;
        var id = categoryComponent.id;
        var changeCategory = categoryComponent.changeCategory;
        var color = active ? "#6daef4" : "#2E8BEF40";
        return (
            <React.Fragment> 
                <li
                    onClick={
                        () => {
                            changeCategory(id);
                        }
                    }
                    className={active ? "active category activeCategory rounded-top" : "category rounded-top"}
                    name={name}
                    style={{"backgroundColor": color}}
                >
                    <button
                        className="btn tab-color"
                    >
                        <h3>{name}</h3>
                    </button>
                </li>
            </React.Fragment>
        )
    }
}

export default Category;