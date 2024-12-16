import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './../../../../SBStyles.css';



class Rating extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sliderValue: this.props.currentRating * 20
        }
    }

<<<<<<< HEAD
    function valuetext(valueText) {
      return valueText;
    }

    function valueLabelFormat(value) {
      return marks.findIndex((mark) => mark.value === value);
    }

    var showRatings = rating["show_ratings"];

    var setSliderValue = rating["setSliderValue"];

    var categoryName = rating["category_name"];
    
    return (
      <Box
        sx={{
          p: 3, display: "flex", width: "90%",
          justifyContent:'center'
        }}

        disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
      >
        <Slider 
          id="slider"

          aria-label="Always visible"
          valueLabelFormat={valueLabelFormat}
          getAriaValueText={valuetext}

          step={null}
          marks={marks}
          valueLabelDisplay={showRatings ? "on" : "off"}
          value={this.state.sliderValue}

          sx={{
            '.MuiSlider-markLabel': {
              fontSize: "1.0rem !important",
              '@media (max-width: 600px)': {
                fontSize: ".55rem !important",
              },
              '@media (max-width: 400px)': {
                fontSize: ".5rem !important",
              },
            },
            '.MuiSlider-thumb': {
              backgroundColor: "#2E8BEF ", 
            },
            '.MuiSlider-track': {
              backgroundColor: "#2E8BEF ", 
              border: '1px solid #2E8BEF '
            },
            '.MuiSlider-mark': {
              height: "0.2rem !important",
              width: "0.2rem !important"
            },
          }}

          onChange={(event) => {
            if(this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;

            setSliderValue(
              this.props.currentUnitTabIndex,
              categoryName,
              event.target.value/20
            );

=======
    componentDidUpdate() {
        if (this.props.currentRating * 20 !== this.state.sliderValue) {
>>>>>>> master
            this.setState({
                sliderValue: this.props.currentRating * 20
            });
        }
    }

    render() {
        var sliderValues = this.props.sliderValues;

        const marks = [];
        let valueIndicator = 0;

        for(let i = 0; i < sliderValues.length; i++){
            marks.push({
                value: valueIndicator,
                label: sliderValues[i].label,
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

        const showRatings = this.props.navbar.state.chosenAssessmentTask["show_ratings"];
        
        return (
            <Box
                sx={{
                    p: 3, display: "flex", width: "90%",
                    justifyContent:'center'
                }}

                disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
            >
                <Slider 
                    id="slider"

                    aria-label="Always visible"
                    valueLabelFormat={valueLabelFormat}
                    getAriaValueText={valuetext}

                    step={null}
                    marks={marks}
                    valueLabelDisplay={showRatings ? "on" : "off"}
                    value={this.state.sliderValue}

                    sx={{
                        '.MuiSlider-markLabel': {
                            fontSize: "1.0rem !important",
                            '@media (max-width: 600px)': {
                                fontSize: ".55rem !important",
                            },
                            '@media (max-width: 400px)': {
                                fontSize: ".5rem !important",
                            },
                        },
                        '.MuiSlider-thumb': {
                            backgroundColor: "#2E8BEF ", 
                        },
                        '.MuiSlider-track': {
                            backgroundColor: "#2E8BEF ", 
                            border: '1px solid #2E8BEF '
                        },
                        '.MuiSlider-mark': {
                            height: "0.2rem !important",
                            width: "0.2rem !important"
                        },
                    }}

                    onChange={(event) => {
                        if(this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;

                        this.props.setRating(Math.floor(event.target.value / 20));

                        this.setState({
                            sliderValue: event.target.value
                        });
                        
                        this.props.autosave();
                    }}

                    disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
                />
            </Box>
        )
    }
}

export default Rating;