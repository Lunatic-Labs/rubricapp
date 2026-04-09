import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import './../../../../SBStyles.css';

interface RatingProps {
    navbar: any;
    currentRating: number;
    sliderValues: { label: string }[];
    setRating: (rating: number) => void;
    autosave: () => void;
}

interface RatingState {
    sliderValue: number;
}

class Rating extends Component<RatingProps, RatingState> {
    constructor(props: RatingProps) {
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

        const marks: { value: number; label: string; valueText: number }[] = [];
        let valueIndicator = 0;

        for(let i = 0; i < sliderValues.length; i++){
            marks.push({
                value: valueIndicator,
                label: sliderValues[i]!.label,
                valueText: i
            })

            valueIndicator = valueIndicator + 20;
        }

        function valuetext(valueText: number): string {
            return String(valueText);
        }

        function valueLabelFormat(value: number) {
            return marks.findIndex((mark: { value: number }) => mark.value === value);
        }

        const showRatings = this.props.navbar.state.chosenAssessmentTask["show_ratings"];
        
        return (
            <Box
                sx={{
                    p: 3, display: "flex", width: "90%",
                    justifyContent:'center'
                }}
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

                    onChange={(_event: Event, value: number | number[]) => {
                        if(this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;
                        const numValue = value as number;
                        this.props.setRating(Math.floor(numValue / 20));
                        this.setState({ sliderValue: numValue });
                        this.props.autosave();
                    }}


                    disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
                />
            </Box>
        );
    }
}

export default Rating;