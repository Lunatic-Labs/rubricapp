import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Box from '@mui/material/Box';
import { genericResourcePUT } from '../../../../utility';

class Section extends Component {
    constructor(props) {
        super(props);
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        var form = navbar.form;
        var category_rating_observable_characteristics_suggestions_json = form.category_rating_observable_characteristics_suggestions_json;

        this.state = {
            rating_observable_characteristics_suggestions_json:
                chosen_complete_assessment_task && chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"]  ?
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

        // Note: Will use when final POST or PUT is made!!!!
        // var setNewTab = navbar.setNewTab;

        if(!readOnly) {
            if(chosen_complete_assessment_task) {
                setTimeout(() => {
                    chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
                    genericResourcePUT(`/completed_assessment?completed_assessment_task_id=${chosen_complete_assessment_task["completed_assessment_id"]}`, 
                        this, JSON.stringify(chosen_complete_assessment_task));
                }, []);

                document.getElementById("formSubmitButton").addEventListener("click", (event) => {
                    event.preventDefault();

                    setTimeout(() => {
                        chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;

                        genericResourcePUT(`/completed_assessment?completed_assessment_task_id=${chosen_complete_assessment_task["completed_assessment_id"]}`, 
                            this, JSON.stringify(chosen_complete_assessment_task));
                    }, 1000);
                });
            } else {
                console.log("Saving Functionality in progress...");
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
            var currentObservableCharacteristic = observableCharacteristics[o];
            navbar.observableCharacteristicComponent = {};
            navbar.observableCharacteristicComponent.setObservable_characteristics = this.setObservable_characteristics;
            navbar.observableCharacteristicComponent.category_name = section["category_name"];
            navbar.observableCharacteristicComponent.observable_characteristics = this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["observable_characteristics"];
            navbar.observableCharacteristicComponent.observableCharacteristic = currentObservableCharacteristic;
            navbar.observableCharacteristicComponent.observableCharacteristic.id = o;
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    navbar={navbar}
                    key={o}
                />
            )
        }

        var suggestionList = [];

        for(var s = 0; s < suggestions.length; s++) {
            var currentSuggestion = suggestions[s];

            navbar.suggestionComponent = {};
            navbar.suggestionComponent.id = s;
            navbar.suggestionComponent.setSuggestions = this.setSuggestions;
            navbar.suggestionComponent.category_name = section["category_name"];
            navbar.suggestionComponent.suggestions = this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["suggestions"];
            navbar.suggestionComponent.suggestion = currentSuggestion;

            suggestionList.push(
                <Suggestion
                    navbar={navbar}
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
                 <div id="rating">
                    <div style={{"backgroundColor":"#6daef4", "borderRadius" : "0px 10px 10px 10px"}} className="main-color">
                        <form className="p-2">
                            <div className="bg-white p-2 m-3 rounded">
                                <h4 className="p-1 h3 fw-bold">Ratings</h4>
                                <h4 className="p-1 h3">{ ratings["rating_description"] }</h4>
                                 <Box sx={{display:"flex" , justifyContent:"center"}}>
                                    <Rating
                                        navbar={navbar}
                                    />
                                 </Box>
                            </div>
                            <div className="test bg-white p-2 m-3 rounded" >
                                <h4 className="h3 p-1 fw-bold">Observable Characteristics</h4>
                                <div>
                                    {observableCharacteristicList}
                                </div>
                            </div>
                            {show_suggestions &&
                                <div className="test bg-white p-2 m-3 rounded">
                                    <h4 className="h3 p-1 fw-bold">Suggestions For Improvement</h4>
                                    <div>
                                        {suggestionList}
                                    </div>
                                </div>
                            }
                            <div className="test bg-white p-3 m-3 rounded">
                                <h4 className="p-1 h3 fw-bold">Comment Box</h4>
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
                            </div>
                            <div className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <button
                                    id="formSubmitButton"
                                    className='btn btn-primary'
                                    disabled={readOnly}
                                >
                                    Submit Assessment
                                </button>
                            </div>
                        </form> 
                    </div>
                 </div>
            </React.Fragment>
        )
    }
}

export default Section;