import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic.js';
import Suggestion from './Suggestion.js';
import Rating from './Rating.js';
import TextArea from './TextArea.js';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';


/**
 * This component is used to display the ratings, observable characteristics, suggestions for improvement,
 * 
 * @param {Object} props
 * @param {Object} props.navbar - Navbar object
 * @param {String} props.category - Category name
 * @param {Object} props.currentRocsData - Current Rating Observable Characteristics data object
 * @param {Object} props.assessmentTaskRubric - Rubric object for the assessment task
 * @param {Boolean} props.isDone - Whether the unit has completed the assessment task
 * @param {Number} props.currentUnitTabIndex - Index of the current unit tab
 * @param {Function} props.handleUnitTabChange - Function to handle the change of unit tab
 * 
 * @param {Function} props.modifyUnitCategoryProperty - Function to handle the updating the category property
 * @param {Function} props.modifyUnitCategoryProperty - Function to handle the updating the category property
 * 
 * @param {Function} props.markForAutosave - Function to mark a unit for autosaving.
 */
class Section extends Component {
    constructor(props) {
        super(props);
        
        this.autosave = debounce(() => {
            this.props.handleSubmit(this.props.isDone);
        }, 2000);
        
        /**
         * @method setCategoryProperty - Handles updating the 
         * @param {String} propertyName - the name of the ROCS category property that is to be changed
         * @param {Any} propertyValue - the new value for the property
         */
        this.setCategoryProperty = (propertyName, propertyValue) => {
            this.props.modifyUnitCategoryProperty(this.props.currentUnitTabIndex, this.props.category, propertyName, propertyValue);
        };
    }
    
    render() {
        const assessmentTaskRubric = this.props.assessmentTaskRubric;
        const currentRocsData = this.props.currentRocsData;
        const category = this.props.category;
        const categoryJson = assessmentTaskRubric["category_json"][category];
        const assessmentTaskRubric = this.props.assessmentTaskRubric;
        const currentRocsData = this.props.currentRocsData;
        const category = this.props.category;
        const categoryJson = assessmentTaskRubric["category_json"][category];
        
        const ratingJson = currentRocsData[category]["rating_json"];
        const ratingJson = currentRocsData[category]["rating_json"];

        const sliderValues = Object.keys(ratingJson).map(option => {
            return {
        const sliderValues = Object.keys(ratingJson).map(option => {
            return {
                "value": option,
                "label": ratingJson[option],
                "key": option,
            };
        });
        
        const observableCharacteristics = categoryJson["observable_characteristics"];

        const observableCharacteristicList = observableCharacteristics.map((observableCharacteristic, index) => {
            return <ObservableCharacteristic
                navbar={this.props.navbar}
                observableCharacteristic={observableCharacteristic}
                observableCharacteristics={currentRocsData[category]["observable_characteristics"]}
                setObservableCharacteristics={(newValue) => this.setCategoryProperty("observable_characteristics", newValue)}
                id={index}
                key={index}
                autosave={this.autosave}
            />;
        });
        
        const suggestions = categoryJson["suggestions"];
        
        const suggestions = categoryJson["suggestions"];

        const suggestionList = suggestions.map((suggestion, index) => {
            return <Suggestion
                navbar={this.props.navbar}
                suggestion={suggestion}
                suggestions={currentRocsData[category]["suggestions"]}
                setCategoryProperty={this.setCategoryProperty}
                setSuggestions={(newValue) => this.setCategoryProperty("suggestions", newValue)}
                id={index}
                key={index}
                autosave={this.autosave}
            />;
        const suggestionList = suggestions.map((suggestion, index) => {
            return <Suggestion
                navbar={this.props.navbar}
                suggestion={suggestion}
                suggestions={currentRocsData[category]["suggestions"]}
                setCategoryProperty={this.setCategoryProperty}
                setSuggestions={(newValue) => this.setCategoryProperty("suggestions", newValue)}
                id={index}
                key={index}
                autosave={this.autosave}
            />;
        });

        const currentRating = currentRocsData[category]["rating"];
        const categoryDescription = currentRocsData[category]["description"];

        return (
            <Box id="rating">
                <Box className="assessment-task-spacing" aria-label="ratingsSection">
                    <FormControl>
                        <Box className="assessment-card" aria-label="ratingsSection">
                            <h4>Ratings</h4>

                            {categoryDescription}
                            {categoryDescription}

                            <Box sx={{display:"flex" , justifyContent:"center"}}>
                                <Rating
                                    navbar={this.props.navbar}
                                    setRating={(newValue) => this.setCategoryProperty("rating", newValue)}
                                    currentRating={currentRating}
                                    sliderValues={sliderValues}
                                    autosave={this.autosave}
                                />
                            </Box>
                        </Box>

                        <Box className="assessment-card" aria-label="observableCharacteristicsSection">
                            <h4>Observable Characteristics</h4>

                            <Box className="checkbox-spacing">
                            {observableCharacteristicList}
                            </Box>
                        </Box>

                        {this.props.navbar.state.chosenAssessmentTask["show_suggestions"] &&
                        {this.props.navbar.state.chosenAssessmentTask["show_suggestions"] &&
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
                                setComments={(newValue) => this.setCategoryProperty("comments", newValue)}
                                currentValue={currentRocsData[category]["comments"]}
                                autosave={this.autosave}
                            />
                        </Box>
                    </FormControl> 
                </Box>
            </Box>
        )
    }
}

export default Section;
