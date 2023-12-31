import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import TextArea from './TextArea';
import Box from '@mui/material/Box';
// import { genericResourcePUT } from '../../../../utility';
import { FormControl, Typography } from '@mui/material';

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

                            {/* TODO Pa: Make a Comment Component and update the componentDidMount() to change the state if the props is different! */}
                            <Box className="assessment-card">
                                <Box><h5>Comment Box</h5></Box>
                                <TextArea
                                    navbar={this.props.navbar}
                                    teamValue={this.props.teamValue}
                                    setComments={this.props.setComments}
                                    currentData={currentData}
                                    categoryName={category}
                                />
                                {/* <textarea
                                    onChange={(comment) => {
                                        this.props.setComments(
                                            this.props.teamValue,
                                            category,
                                            comment.target.value
                                        );
                                    }}
                                    className="form-control h3 p-3"
                                    id="comment"
                                    rows="5"
                                    placeholder="Leave comments for improvement..."
                                    defaultValue={currentData[category]["comments"]}
                                ></textarea> */}
                            </Box>
                            <Box className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <button
                                    id="formSubmitButton"
                                    className='btn btn-primary'
                                >
                                    Submit Assessment
                                </button>
                            </Box>
                        
                        </FormControl> 
                    </Box>
                 </Box>
            </React.Fragment>
        )
    }
}

export default Section;