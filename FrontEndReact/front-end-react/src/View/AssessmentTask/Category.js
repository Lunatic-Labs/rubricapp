import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Category extends Component {
    render() {
        var name = this.props.name;
        var active = this.props.active;
        var id = this.props.id;
        const changeCategory = this.props.changeCategory;
        return (
            <React.Fragment>
                <li onClick={() => changeCategory(id)} className={active ? "active category activeCategory":"category"} name={name} style={{"borderRadius" : "1rem","backgroundColor": "#2E8BEF40"}}>
                    <button className="btn tab-color">{name}</button>
                </li>
            </React.Fragment>
        )
    }
}

export default Category;