import React, { Component } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

class ReportDD extends Component{
    const options = [
    'one', 'two', 'three'
    ];
    const defaultOption = options[0];
    <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />;
}