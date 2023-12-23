import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './../../../../SBStyles.css'

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: this.props.rating.stored_value*20
    }
  }

  render() {
    var rating = this.props.rating;
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
              sx={{
                '.MuiSlider-markLabel': {
                  fontSize: "14px !important", 
                },
                '.MuiSlider-thumb': {
                  backgroundColor: "#2E8BEF ", 
                },
                '.MuiSlider-track': {
                  backgroundColor: "#2E8BEF ", 
                  border: '1px solid #2E8BEF '
                },
                '.MuiSlider-mark': {
                  height: "0.1rem !important",
                  width: "0.1rem !important"
                },
              }}
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
            />
        </Box>
      </React.Fragment>
    )
  }
}

export default Rating;