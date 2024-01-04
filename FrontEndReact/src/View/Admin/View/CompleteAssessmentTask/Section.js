import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import TextArea from './TextArea';
import Box from '@mui/material/Box';
// import { genericResourcePUT } from '../../../../utility';
import { FormControl, Typography, Button } from '@mui/material';

class Section extends Component {

    render() {
        var rubric = this.props.rubric;
        var currentData = this.props.currentData;
        var category = this.props.category;

        var category_json = rubric["category_json"][category];

        var rating_json = currentData[category]["rating_json"];

        var sliderValues = [];

        Object.keys(rating_json).map((option) => {
            sliderValues = [...sliderValues, {
                "value": option,
                "label": rating_json[option],
                "key": option,
            }];
            return option;
        });
        
        var observable_characteristics = category_json["observable_characteristics"];
        var suggestions = category_json["suggestions"];

        var observableCharacteristicList = [];

        observable_characteristics.map((oc, index) => {
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    navbar={this.props.navbar}
                    teamValue={this.props.teamValue}
                    observableCharacteristic={observable_characteristics[index]}
                    categoryName={category}
                    setObservable_characteristics={this.props.setObservable_characteristics}
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
        rating["show_ratings"] = this.props.navbar.state.chosen_assessment_task["show_ratings"];
        rating["show_suggestions"] = this.props.navbar.state.chosen_assessment_task["show_suggestions"];
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
                            <Box sx={{
                                display:"flex",
                                justifyContent:"end",
                                gap:"20px"
                            }}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    className='btn btn-secondary'
                                    onClick={this.handleSaveForLater}
                                >
                                    Save for Later
                                </Button>

                                <Button
                                    id="formSubmitButton"
                                    variant="contained"
                                    color="primary"
                                    onClick={this.props.handleSubmit}
                                >
                                    Submit Assessment
                                </Button>
                            </Box>
                        
                        </FormControl> 
                    </Box>
                 </Box>
            </React.Fragment>
        )
    }
}

export default Section;