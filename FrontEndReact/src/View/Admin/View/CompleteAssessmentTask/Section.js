import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Box from '@mui/material/Box';
// import { genericResourcePUT } from '../../../../utility';
import { FormControl, Typography } from '@mui/material';


class Section extends Component {
    constructor(props) {
        super(props);

        var chosen_complete_assessment_task = this.props.navbar.state.chosen_complete_assessment_task;
        var teamData = this.props.teamData;
        var currentTeamTab = this.props.currentTeamTab;

        // console.log(teamData)
        // this.state = {
        //     rating_observable_characteristics_suggestions_json:
        //         chosen_complete_assessment_task && chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"]  ?
        //             chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] :
        //             this.props.rubric["category_rating_observable_characteristics_suggestions_json"],
        //     error: null,
        //     errorMessage: null
        // }

        this.setSliderValue = (category_name, rating) => {
            // var json = this.state.rating_observable_characteristics_suggestions_json;
            var json = teamData[currentTeamTab];
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
        // var navbar = this.props.navbar;
        // var state = navbar.state;
        // // var chosen_complete_assessment_task = state.chosen_complete_assessment_task;
        // // Note: Will use when final POST or PUT is made!!!!
        // // var setNewTab = navbar.setNewTab;

        // if(!readOnly) {
        //     if(chosen_complete_assessment_task) {
        //         setTimeout(() => {
        //             chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;
        //             genericResourcePUT(`/completed_assessment?completed_assessment_task_id=${chosen_complete_assessment_task["completed_assessment_id"]}`, 
        //                 this, JSON.stringify(chosen_complete_assessment_task));
        //         }, []);

        //         document.getElementById("formSubmitButton").addEventListener("click", (event) => {
        //             event.preventDefault();

        //             setTimeout(() => {
        //                 chosen_complete_assessment_task["rating_observable_characteristics_suggestions_data"] = this.state.rating_observable_characteristics_suggestions_json;

        //                 genericResourcePUT(`/completed_assessment?completed_assessment_task_id=${chosen_complete_assessment_task["completed_assessment_id"]}`, 
        //                     this, JSON.stringify(chosen_complete_assessment_task));
        //             }, 1000);
        //         });
        //     } else {
        //         // console.log("Saving Functionality in progress...");
        //         // console.log(this.state.rating_observable_characteristics_suggestions_json);
        //     }
        // }
    }
    
    render() {
        var rubric = this.props.rubric;
        var category = this.props.category;
        var category_json = rubric["category_json"][category];
        var crocs_json = rubric["category_rating_observable_characteristics_suggestions_json"];

        var rating_json = crocs_json[category]["rating_json"];
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
                    observableCharacteristic={observable_characteristics[index]}
                    categoryName={category}
                    setObservable_characteristics={this.setObservable_characteristics}
                    observableCharacteristics={crocs_json[category]["observable_characteristics"]}
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
                    suggestion={suggestions[index]}
                    suggestions={crocs_json[category]["suggestions"]}
                    setSuggestions={this.setSuggestions}
                    categoryName={category}
                    id={index}
                    key={index}
                />
            );
            return s;
        });

        var rating = {};
        rating["category_name"] = category;
        rating["stored_value"] = crocs_json[category]["rating"];
        rating["data"] = sliderValues;
        rating["setSliderValue"] = this.setSliderValue;
        rating["name"] = category;
        rating["show_ratings"] = this.props.navbar.state.chosen_assessment_task["show_ratings"];
        rating["show_suggestions"] = this.props.navbar.state.chosen_assessment_task["show_suggestions"];
        rating["description"] = crocs_json[category]["description"];
        rating["stored_value"] = crocs_json[category]["rating"];

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
                                        setSliderValue={this.setSliderValue}
                                        navbar={this.props.navbar}
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
                                <textarea
                                    onChange={(comment) => {
                                        var temp = this.state.rating_observable_characteristics_suggestions_json;

                                        temp[category]["comments"] = comment.target.value;

                                        this.setState({
                                            rating_observable_characteristics_suggestions_json: temp
                                        });
                                    }}
                                    className="form-control h3 p-3"
                                    id="comment"
                                    rows="5"
                                    placeholder="Leave comments for improvement..."
                                    // defaultValue={this.state.rating_observable_characteristics_suggestions_json[category]["comments"]}
                                ></textarea>
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