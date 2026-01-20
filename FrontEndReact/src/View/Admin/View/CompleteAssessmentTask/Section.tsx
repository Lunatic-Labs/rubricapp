import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import TextArea from './TextArea';
import Box from '@mui/material/Box';
import { FormControl } from '@mui/material';

interface SectionProps {
    navbar: any;
    category: string;
    currentRocsData: any;
    assessmentTaskRubric: any;
    isDone: boolean;
    currentUnitTabIndex: number;
    handleUnitTabChange: (index: number) => void;
    modifyUnitCategoryProperty: (unitIndex: number, categoryName: string, propertyName: string, propertyValue: any) => void;
    markForAutosave: (unitIndex: number) => void;
}

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
 * 
 * @param {Function} props.markForAutosave - Function to mark a unit for autosaving.
 */
class Section extends Component<SectionProps> {
    autosave: any;
    setCategoryProperty: any;
    constructor(props: any) {
        super(props);
        
        this.autosave = () => {
            this.props.markForAutosave(this.props.currentUnitTabIndex);
        };
        
        /**
         * @method setCategoryProperty - Handles updating the 
         * @param {String} propertyName - the name of the ROCS category property that is to be changed
         * @param {Any} propertyValue - the new value for the property
         */
        this.setCategoryProperty = (propertyName: any, propertyValue: any) => {
            this.props.modifyUnitCategoryProperty(this.props.currentUnitTabIndex, this.props.category, propertyName, propertyValue);
        };
    }

    render() {
        const assessmentTaskRubric = this.props.assessmentTaskRubric;
        const currentRocsData = this.props.currentRocsData;
        const category = this.props.category;
        const categoryJson = assessmentTaskRubric["category_json"][category];
        
        const ratingJson = currentRocsData[category]["rating_json"];

        const sliderValues = Object.keys(ratingJson).map(option => {
            return {
                "value": option,
                "label": ratingJson[option],
                "key": option,
            };
        });
        
        const observableCharacteristics = categoryJson["observable_characteristics"];

        const observableCharacteristicList = observableCharacteristics.map((observableCharacteristic: any, index: any) => {
            return (
                <ObservableCharacteristic
                    navbar={this.props.navbar}
                    observableCharacteristic={observableCharacteristic}
                    observableCharacteristics={currentRocsData[category]["observable_characteristics"]}
                    setObservableCharacteristics={(newValue: any) => this.setCategoryProperty("observable_characteristics", newValue)}
                    id={index}
                    key={index}
                    autosave={this.autosave}
                />
            );
        });
        
        const suggestions = categoryJson["suggestions"];

        const suggestionList = suggestions.map((suggestion: any, index: any) => {
            return (
                <Suggestion
                    navbar={this.props.navbar}
                    suggestion={suggestion}
                    suggestions={currentRocsData[category]["suggestions"]}
                    setCategoryProperty={this.setCategoryProperty}
                    setSuggestions={(newValue: any) => this.setCategoryProperty("suggestions", newValue)}
                    id={index}
                    key={index}
                    autosave={this.autosave}
                />
            );
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

                            <Box sx={{display:"flex" , justifyContent:"center"}}>
                                <Rating
                                    navbar={this.props.navbar}
                                    setRating={(newValue: any) => this.setCategoryProperty("rating", newValue)}
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
                                setComments={(newValue: any) => this.setCategoryProperty("comments", newValue)}
                                currentValue={currentRocsData[category]["comments"]}
                                autosave={this.autosave}
                            />
                        </Box>
                    </FormControl> 
                </Box>
            </Box>
        );
    }
}

export default Section;
