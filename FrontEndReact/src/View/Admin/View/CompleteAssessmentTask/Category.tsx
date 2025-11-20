import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Tab } from '@mui/material';



class Category extends Component {
    render() {
        var navbar = this.props.navbar;
        var categoryComponent = navbar.categoryComponent;
        var name = categoryComponent.name;
        var id = categoryComponent.id;
        
        return (
            <React.Fragment> 
                <Tab
                    label={name}
                    value={id}
                >
                </Tab>
            </React.Fragment>
        )
    }
}

export default Category;