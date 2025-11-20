// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Slider' or its c... Remove this comment to see the full error message
import Slider from '@mui/material/Slider';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Box' or its corr... Remove this comment to see the full error message
import Box from '@mui/material/Box';
import './../../../../SBStyles.css';



class Rating extends Component {
    props: any;
    setState: any;
    state: any;
    constructor(props: any) {
        super(props);

        this.state = {
            sliderValue: this.props.currentRating * 20
        }
    }

    componentDidUpdate() {
        if (this.props.currentRating * 20 !== this.state.sliderValue) {
            this.setState({
                sliderValue: this.props.currentRating * 20
            });
        }
    }

    render() {
        var sliderValues = this.props.sliderValues;

        const marks: any = [];
        let valueIndicator = 0;

        for(let i = 0; i < sliderValues.length; i++){
            marks.push({
                value: valueIndicator,
                label: sliderValues[i].label,
                valueText: i
            })

            valueIndicator = valueIndicator + 20;
        }

        function valuetext(valueText: any) {
            return valueText;
        }

        function valueLabelFormat(value: any) {
            // @ts-expect-error TS(7006): Parameter 'mark' implicitly has an 'any' type.
            return marks.findIndex((mark) => mark.value === value);
        }

        const showRatings = this.props.navbar.state.chosenAssessmentTask["show_ratings"];
        
        return (
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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

                    onChange={(event: any) => {
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
        );
    }
}

export default Rating;