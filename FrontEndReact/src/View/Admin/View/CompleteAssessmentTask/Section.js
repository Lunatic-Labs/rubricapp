import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Box from '@mui/material/Box';
import { API_URL } from '../../../../App';
import { FormControl, Typography } from '@mui/material';

class Section extends Component {
    constructor(props) {
        super(props);
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var form = navbar.form;
        var category_rating_observable_characteristics_suggestions_json = form.category_rating_observable_characteristics_suggestions_json;
        this.state = {

            // Aldo Idea 
            // start an empty object here and create the keys using the teams id/ team names 
            // every key will be an array of values that stores every category for teams. 
            


            rating_observable_characteristics_suggestions_json:
                chosen_complete_assessment_task ?
                chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] :
                category_rating_observable_characteristics_suggestions_json,
            error: null,
            errorMessage: null
        }
        this.setSliderValue = (category_name, rating) => {
            var json = this.state.rating_observable_characteristics_suggestions_json;
            json[category_name]["rating"] = rating;
            this.setState({
                rating_observable_characteristics_suggestions_json: json,
            });
        }
        this.setObservable_characteristics = (category_name, observable_characteristics) => {
            var json = this.state.rating_observable_characteristics_suggestions_json
            json[category_name]["observable_characteristics"] = observable_characteristics;
            this.setState({
                rating_observable_characteristics_suggestions_json: json
            })
        }
        this.setSuggestions = (category_name, suggestions) => {
            var json = this.state.rating_observable_characteristics_suggestions_json
            json[category_name]["suggestions"] = suggestions;
            this.setState({
                rating_observable_characteristics_suggestions_json: json
            })
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
        var readOnly = completeAssessmentTaskReadOnly.readOnly;
        var state = navbar.state;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var setNewTab = navbar.setNewTab;
        if(!readOnly) {
            if(chosen_complete_assessment_task) {
                setTimeout(() => {
                    chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
                    fetch(API_URL + `/completed_assessment/${chosen_complete_assessment_task["completed_assessment_id"]}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(chosen_complete_assessment_task)
                    })
                    .then(res => res.json())
                    .then(
                        (result) => {
                            if(result["success"] === false) {
                                console.log(result["message"]);
                            } else {
                                console.log("Successfully auto saved Completed Assessment!");
                            }
                        },
                        (error) => {
                            console.log(error);
                        }
                    )
                }, []);

                document.getElementById("formSubmitButton").addEventListener("click", (event) => {
                    event.preventDefault();
                    setTimeout(() => {
                        chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
                        fetch(API_URL + `/completed_assessment/${chosen_complete_assessment_task["completed_assessment_id"]}`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(chosen_complete_assessment_task)
                        })
                        .then(res => res.json())
                        .then(
                            (result) => {
                                if(result["success"] === false) {
                                    this.setState({
                                        errorMessage: result["message"]
                                    });
                                } else {
                                    setTimeout(() => {
                                        setNewTab("ViewComplete");
                                    }, 500);
                                }
                            },
                            (error) => {
                                this.setState({
                                    error: error
                                });
                            }
                        )
                    }, 1000);
                });
            } else {
                console.log("Saving Functionality in progress...");
                console.log(this.state.rating_observable_characteristics_suggestions_json);
            }
        }
    }
    
    render() {
        var navbar = this.props.navbar;
        var form = navbar.form;
        var section = navbar.form.section;

        var ratings = section["ratings"][0];
        var observableCharacteristics = section["observable_characteristics"];
        var suggestions = section["suggestions"];
        var rating_json = ratings["rating_json"];
        var sliderValues = [];
        
        for(var i = 0; i < 6; i++) {
            var json = {};
            json["value"] = i;
            json["label"] = rating_json[i];
            json["key"] = i;
            sliderValues = [...sliderValues, json];
        }

        var observableCharacteristicList = [];
        for(var o = 0; o < observableCharacteristics.length; o++) {
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    navbar={navbar}
                    observableCharacteristic={observableCharacteristics[o]}
                    categoryName={section["category_name"]}
                    setObservable_characteristics={this.setObservable_characteristics}
                    observableCharacteristics={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["observable_characteristics"]}
                    id={o}
                    key={o}
                />
            )
        }

        var suggestionList = [];
        for(var s = 0; s < suggestions.length; s++) {
            suggestionList.push(
                <Suggestion
                    navbar={navbar}
                    suggestion={suggestions[s]}
                    suggestions={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["suggestions"]}
                    setSuggestions={this.setSuggestions}
                    categoryName={section["category_name"]}
                    id={s}
                    key={s}
                />
            );
        }

        var show_ratings = form.show_ratings;

        navbar.rating = {};
        navbar.rating.category_name = section["category_name"];
        navbar.rating.stored_value = this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["rating"];
        navbar.rating.data = sliderValues;
        navbar.rating.setSliderValue = this.setSliderValue;
        navbar.rating.name = section["name"];
        navbar.rating.show_ratings = show_ratings;
        
        var show_suggestions = form.show_suggestions;
        var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
        var readOnly = completeAssessmentTaskReadOnly.readOnly;

        return (
             <React.Fragment>
                 <Box id="rating">
                    <Box className="assessment-task-spacing">
                        <FormControl>
                            <Box className="assessment-card">
                                <h5>Ratings</h5>
                                <Typography sx={{fontSize: "18px"}}>{ ratings["rating_description"] }</Typography>
                                <Box sx={{display:"flex" , justifyContent:"center"}}>
                                    <Rating
                                        navbar={navbar}
                                    />
                                </Box>
                            </Box>
                            <Box className="assessment-card" >
                                <h5>Observable Characteristics</h5>
                                <Box className="checkbox-spacing">
                                    {observableCharacteristicList}
                                </Box>
                            </Box>
                            {show_suggestions &&
                                <Box className="assessment-card">
                                    <h5>Suggestions For Improvement</h5>
                                    <Box className="checkbox-spacing">
                                        {suggestionList}
                                    </Box>
                                </Box>
                            }
                            <Box className="assessment-card">
                                <Box><h5>Comment Box</h5></Box>
                                <textarea
                                    onChange={(comment) => {
                                        var temp = this.state.rating_observable_characteristics_suggestions_json;
                                        temp[section["category_name"]]["comments"] = comment.target.value;
                                        this.setState({
                                            rating_observable_characteristics_suggestions_json: temp
                                        });
                                    }}
                                    className="form-control h3 p-3"
                                    id="comment"
                                    rows="5"
                                    placeholder="Leave comments for improvement..."
                                    disabled={readOnly}
                                    defaultValue={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["comments"]}
                                ></textarea>
                            </Box>
                            <Box className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <button
                                    id="formSubmitButton"
                                    className='btn btn-primary'
                                    disabled={readOnly}
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