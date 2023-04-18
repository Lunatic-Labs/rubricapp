import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Category extends Component {
    render() {
        var name = this.props.name;
        var active = this.props.active;
        var id = this.props.id;
        const changeCategory = this.props.changeCategory;
        var color = active ? "rgb(46, 139, 239)":"#2E8BEF40";
        return (
            <React.Fragment> 
                <li onClick={() => changeCategory(id)} className={active ? "active category activeCategory rounded-top":"category rounded-top"} name={name} style={{"backgroundColor": color}}>
                    <button className="btn tab-color">{name}</button>
                </li>
            </React.Fragment>
        )
    }
}

export default Category;