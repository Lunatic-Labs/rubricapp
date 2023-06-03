import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './Slider.css'

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: this.props.stored_value*20
    }
  }
  render() {
    const data = this.props.data;
    const marks = [];
    var valueIndicator = 0;
    for(let i = 0; i < data.length; i++){
      marks.push({
        value: valueIndicator,
        label: data[i].label,
        valueText: i
      })
      valueIndicator = valueIndicator + 20;
    }
    function valuetext(valueText) {
      return valueText;
    }
    function valueLabelFormat(value) {
      return marks.findIndex((mark) => mark.value === value);
    }
    return (
      <React.Fragment>
        <Box sx={{p: 3, display: "flex", width: 800, justifyContent:'center'}}>
            <Slider 
              id="slider"
              aria-label="Always visible"
              valueLabelFormat={valueLabelFormat}
              getAriaValueText={valuetext}
              step={null}
              marks={marks}
              valueLabelDisplay={this.props.show_ratings ? "on":"off"}
              value={this.state.sliderValue}
              onChange={(event) => {
                this.props.setSliderValue(
                  this.props.category_name,
                  event.target.value/20,
                  this.props.name
                );
                this.setState({
                  sliderValue: event.target.value
                })
              }}
              disabled={this.props.readOnly}
            />
        </Box>
      </React.Fragment>
    )
  }
}

export default Rating;