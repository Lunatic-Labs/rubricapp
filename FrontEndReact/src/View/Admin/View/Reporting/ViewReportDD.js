import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export default class ViewReportDD extends Component{
    render(){
        const options = [
        'one', 'two', 'three'
        ];
        const defaultOption = options[0];
        return (
        <>
        <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;
        </>
        )
    }
}
