import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './../../../../SBStyles.css'

class Rating extends Component {
  constructor(props) {
    super(props);
    var navbar = this.props.navbar;
    var rating = navbar.rating;
    var stored_value = rating.stored_value;
    this.state = {
      sliderValue: stored_value*20
    }
  }
  render() {
    var navbar = this.props.navbar;
    var rating = navbar.rating;
    var data = rating.data;

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

    var show_ratings = rating.show_ratings;
    var setSliderValue = rating.setSliderValue;
    var category_name = rating.category_name;
    var name = rating.name;
    var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
    var readOnly = completeAssessmentTaskReadOnly.readOnly;
    
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
              valueLabelDisplay={show_ratings ? "on" : "off"}
              value={this.state.sliderValue}
              onChange={(event) => {
                setSliderValue(
                  category_name,
                  event.target.value/20,
                  name
                );
                this.setState({
                  sliderValue: event.target.value
                })
              }}
              disabled={readOnly}
            />
        </Box>
      </React.Fragment>
    )
  }
}

export default Rating;