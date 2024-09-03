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
        
        const autosave = () => {
            this.props.handleSubmit(true);
        };

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
                    unitValue={this.props.unitValue}
                    observableCharacteristic={observableCharacteristics[index]}
                    categoryName={category}
                    setObservableCharacteristics={this.props.setObservableCharacteristics}
                    observableCharacteristics={currentData[category]["observable_characteristics"]}
                    id={index}
                    key={index}
                    isUnitCompleteAssessmentComplete={this.props.isUnitCompleteAssessmentComplete}
                    autosave={autosave}
                />
            );

            return oc;
        });

        var suggestionList = [];

        suggestions.map((s, index) => {
            suggestionList.push(
                <Suggestion
                    navbar={this.props.navbar}
                    unitValue={this.props.unitValue}
                    suggestion={suggestions[index]}
                    suggestions={currentData[category]["suggestions"]}
                    setSuggestions={this.props.setSuggestions}
                    categoryName={category}
                    id={index}
                    key={index}
                    isUnitCompleteAssessmentComplete={this.props.isUnitCompleteAssessmentComplete}
                    autosave={autosave}
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
            <Box id="rating">
                <Box className="assessment-task-spacing" aria-label="ratingsSection">
                    <FormControl>
                        <Box className="assessment-card" aria-label="ratingsSection">
                            <h4>Ratings</h4>

                            {rating["description"] }

                            <Box sx={{display:"flex" , justifyContent:"center"}}>
                                <Rating
                                    navbar={this.props.navbar}
                                    setSliderValue={this.props.setSliderValue}
                                    unitValue={this.props.unitValue}
                                    rating={rating}
                                    isUnitCompleteAssessmentComplete={this.props.isUnitCompleteAssessmentComplete}
                                    autosave={autosave}
                                />
                            </Box>
                        </Box>

                        <Box className="assessment-card" aria-label="observableCharacteristicsSection">
                            <h4>Observable Characteristics</h4>

                            <Box className="checkbox-spacing">
                            {observableCharacteristicList}
                            </Box>
                        </Box>

                        {rating["show_suggestions"] &&
                            <Box className="assessment-card" aria-label="suggestionsForImprovementSection">

                                <h4>Suggestions For Improvement</h4>

                                <Box className="checkbox-spacing">
                                {suggestionList}
                                </Box>
                            </Box>
                        }

                        <Box className="assessment-card" aria-label="commentBoxSection">
                            <Box><h4>Comment Box</h4></Box>
                            <TextArea
                                navbar={this.props.navbar}
                                unitValue={this.props.unitValue}
                                setComments={this.props.setComments}
                                currentData={currentData}
                                categoryName={category}
                                isUnitCompleteAssessmentComplete={this.props.isUnitCompleteAssessmentComplete}
                                autosave={autosave}
                            />
                        </Box>
                    </FormControl> 
                </Box>
            </Box>
        )
    }
}

export default Section;
