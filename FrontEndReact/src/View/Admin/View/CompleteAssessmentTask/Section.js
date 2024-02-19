import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic.js';
import Suggestion from './Suggestion.js';
import Rating from './Rating.js';
import TextArea from './TextArea.js';
import Box from '@mui/material/Box';
import { FormControl, Typography } from '@mui/material';



class Section extends Component {
    render() {
        var rubric = this.props.rubric;
        var currentData = this.props.currentData;
        var category = this.props.category;

        var categoryJson = rubric["category_json"][category];

        var ratingJson = currentData[category]["rating_json"];

        var sliderValues = [];

        Object.keys(ratingJson).map((option) => {
            sliderValues = [...sliderValues, {
                "value": option,
                "label": ratingJson[option],
                "key": option,
            }];
            return option;
        });
        
        var observableCharacteristics = categoryJson["observable_characteristics"];
        var suggestions = categoryJson["suggestions"];

        var observableCharacteristicList = [];

        observableCharacteristics.map((oc, index) => {
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    navbar={this.props.navbar}
                    teamValue={this.props.teamValue}
                    observableCharacteristic={observableCharacteristics[index]}
                    categoryName={category}
                    setObservableCharacteristics={this.props.setObservableCharacteristics}
                    observableCharacteristics={currentData[category]["observable_characteristics"]}
                    id={index}
                    key={index}
                />
            );

            return oc;
        });

        var suggestionList = [];

        suggestions.map((s, index) => {
            suggestionList.push(
                <Suggestion
                    navbar={this.props.navbar}
                    teamValue={this.props.teamValue}
                    suggestion={suggestions[index]}
                    suggestions={currentData[category]["suggestions"]}
                    setSuggestions={this.props.setSuggestions}
                    categoryName={category}
                    id={index}
                    key={index}
                />
            );

            return s;
        });


        var rating = {};

        rating["category_name"] = category;
        rating["stored_value"] = currentData[category]["rating"];
        rating["data"] = sliderValues;
        rating["setSliderValue"] = this.props.setSliderValue;
        rating["name"] = category;
        rating["show_ratings"] = this.props.navbar.state.chosenAssessmentTask["show_ratings"];
        rating["show_suggestions"] = this.props.navbar.state.chosenAssessmentTask["show_suggestions"];
        rating["description"] = currentData[category]["description"];

        return (
             <React.Fragment>
                 <Box id="rating">
                    <Box className="assessment-task-spacing">
                        <FormControl>
                            <Box className="assessment-card">
                                <h5>Ratings</h5>

                                <Typography sx={{fontSize: "18px"}}>{ rating["description"] }</Typography>

                                <Box sx={{display:"flex" , justifyContent:"center"}}>
                                    <Rating
                                        setSliderValue={this.props.setSliderValue}
                                        navbar={this.props.navbar}
                                        teamValue={this.props.teamValue}
                                        rating={rating}
                                    />
                                </Box>
                            </Box>

                            <Box className="assessment-card" >
                                <h5>Observable Characteristics</h5>

                                <Box className="checkbox-spacing">
                                    {observableCharacteristicList}
                                </Box>
                            </Box>

                            {rating["show_suggestions"] &&
                                <Box className="assessment-card">

                                    <h5>Suggestions For Improvement</h5>

                                    <Box className="checkbox-spacing">
                                        {suggestionList}
                                    </Box>
                                </Box>
                            }

                            <Box className="assessment-card">
                                <Box><h5>Comment Box</h5></Box>
                                <TextArea
                                    navbar={this.props.navbar}
                                    teamValue={this.props.teamValue}
                                    setComments={this.props.setComments}
                                    currentData={currentData}
                                    categoryName={category}
                                />
                            </Box>
                        </FormControl> 
                    </Box>
                 </Box>
            </React.Fragment>
        )
    }
}

export default Section;