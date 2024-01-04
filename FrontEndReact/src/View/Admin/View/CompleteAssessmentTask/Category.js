import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Tab } from '@mui/material';

class Category extends Component {
    render() {
        var navbar = this.props.navbar;
        var categoryComponent = navbar.categoryComponent;
        var name = categoryComponent.name;
        var active = categoryComponent.active;
        var id = categoryComponent.id;
        
        return (
            <React.Fragment> 
                <Tab
                    // onClick={
                    //     () => {
                    //         changeCategory(id);
                    //     }
                    // }
                    // // className={active ? "active category activeCategory rounded-top" : "category rounded-top"}
                    label={name}
                    value={id}
                    // style={{"backgroundColor": color}}
                >
                    {/* <button
                        className="btn tab-color"
                    >
                        <h3>{name}</h3>
                    </button> */}
                </Tab>
            </React.Fragment>
        )
    }
}

export default Category;