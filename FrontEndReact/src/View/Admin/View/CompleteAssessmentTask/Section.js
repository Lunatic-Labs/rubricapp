import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Box from '@mui/material/Box';

class Section extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating_observable_characteristics_suggestions_json:
                this.props.chosen_complete_assessment_task ?
                this.props.chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] :
                this.props.category_rating_observable_characteristics_suggestions_json,
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
        if(!this.props.readOnly) {
            if(this.props.chosen_complete_assessment_task) {
                setTimeout(() => {
                    this.props.chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
                    fetch(`http://127.0.0.1:5000/api/completed_assessment/${this.props.chosen_complete_assessment_task["completed_assessment_id"]}`, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(this.props.chosen_complete_assessment_task)
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
                        this.props.chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
                        fetch(`http://127.0.0.1:5000/api/completed_assessment/${this.props.chosen_complete_assessment_task["completed_assessment_id"]}`, {
                            method: 'PUT',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(this.props.chosen_complete_assessment_task)
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
                                        this.props.setNewTab("ViewComplete");
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
            }
        }
    }
    render() {
        var section = this.props.section;
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
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    id={o}
                    setObservable_characteristics={this.setObservable_characteristics}
                    category_name={section["category_name"]}
                    observable_characteristics={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["observable_characteristics"]}
                    observableCharacteristic={currentObservableCharacteristic}
                    key={o}
                    readOnly={this.props.readOnly}
                />)
        }
        var suggestionList = [];
        for(var s = 0; s < suggestions.length; s++) {
            var currentSuggestion = suggestions[s];
            suggestionList.push(
                <Suggestion
                    id={s}
                    setSuggestions={this.setSuggestions}
                    category_name={section["category_name"]}
                    suggestions={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["suggestions"]}
                    suggestion={currentSuggestion}
                    key={s}
                    show_suggestions={this.props.show_suggestions}
                    readOnly={this.props.readOnly}
                />);
        }
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
                                        category_name={section["category_name"]}
                                        stored_value={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["rating"]}
                                        data={sliderValues}
                                        setSliderValue={this.setSliderValue}
                                        name={section["name"]}
                                        show_ratings={this.props.show_ratings}
                                        readOnly={this.props.readOnly}
                                    />
                                 </Box>
                            </div>
                            <div className="test bg-white p-2 m-3 rounded" >
                                <h4 className="h3 p-1 fw-bold">Observable Characteristics</h4>
                                <div>
                                    {observableCharacteristicList}
                                </div>
                            </div>
                            {this.props.show_suggestions &&
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
                                        temp[this.props.section["category_name"]]["comments"] = comment.target.value;
                                        this.setState({
                                            rating_observable_characteristics_suggestions_json: temp
                                        });
                                    }}
                                    className="form-control h3 p-3"
                                    id="comment"
                                    rows="5"
                                    placeholder="Leave comments for improvement..."
                                    disabled={this.props.readOnly}
                                    defaultValue={this.state.rating_observable_characteristics_suggestions_json[section["category_name"]]["comments"]}
                                ></textarea>
                            </div>
                            <div className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <button
                                    id="formSubmitButton"
                                    className='btn btn-primary'
                                    disabled={this.props.readOnly}
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