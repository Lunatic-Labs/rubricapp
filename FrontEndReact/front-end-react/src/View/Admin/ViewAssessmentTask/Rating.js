import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
class Rating extends Component {
    render() {
        
        const data = this.props.data
        // Can be refactored!!! 
        const marks = [];

        var valueIndicator = 0;
          for(let i = 0; i < data.length; i++){
           
            marks.push(
                {
                    value: valueIndicator,
                    label: data[i].label,
                    valueText: i
                }
                
            )
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
                
                <Box sx={{p :3, display: "flex", width: 800, justifyContent:'center'}}>
                    <Slider
                    aria-label="Always visible"
                    defaultValue={0}
                    valueLabelFormat={valueLabelFormat}
                    getAriaValueText={valuetext}
                    step={null}
                    marks={marks}
                    valueLabelDisplay="on"
                    
                    />
                </Box>
                
            </React.Fragment>
        )
    }
}

export default Rating;