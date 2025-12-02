import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Tab } from '@mui/material';

interface CategoryProps {
    navbar: any;
}

class Category extends Component<CategoryProps> {
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
                />
            </React.Fragment>
        )
    }
}

export default Category;