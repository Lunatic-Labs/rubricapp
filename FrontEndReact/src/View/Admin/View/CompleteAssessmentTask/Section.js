import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Box from '@mui/material/Box';
// import { genericResourcePUT } from '../../../../utility';
import { FormControl, Typography } from '@mui/material';
import TeamsTab from './TeamsTab';


class Section extends Component {
    constructor(props) {
        super(props);
        var currentTeamTab = this.props.currentTeamTab
        this.state = {
            teamRatingData: {},
            currentTeamTab: currentTeamTab
        }

    }
    componentDidMount() {

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

        var teamData = this.props.teamData;
        var teamInfoKeys = Object.keys(teamData);
        const teamRatingData = {};

        teamInfoKeys.forEach((key) => {
            teamRatingData[key] = {
                    category_name: category,
                    stored_value: crocs_json[category]["rating"],
                    data: sliderValues,
                    setSliderValue: this.props.setSliderValue,
                    name: category,
                    show_ratings: this.props.navbar.state.chosen_assessment_task["show_ratings"],
                    show_suggestions: this.props.navbar.state.chosen_assessment_task["show_suggestions"],
                    description: crocs_json[category]["description"],
                    stored_value: crocs_json[category]["rating"],
            };
        });
    
        this.setState({
            teamRatingData: teamRatingData,
        });


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
   
        
        var observable_characteristics = category_json["observable_characteristics"];
        var suggestions = category_json["suggestions"];

        var observableCharacteristicList = [];

        observable_characteristics.map((oc, index) => {
            observableCharacteristicList.push(
                <ObservableCharacteristic
                    navbar={this.props.navbar}
                    observableCharacteristic={observable_characteristics[index]}
                    categoryName={category}
                    setObservable_characteristics={this.props.setObservable_characteristics}
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
                    setSuggestions={this.props.setSuggestions}
                    categoryName={category}
                    id={index}
                    key={index}
                />
            );
            return s;
        });

        var currentTeamTab = this.state.currentTeamTab
        console.log(this.state.teamRatingData)

        return (
             <React.Fragment>
                 <Box id="rating">
                    <Box className="assessment-task-spacing">
                        <FormControl>
                            <Box className="assessment-card">
                                <h5>Ratings</h5>

                                {/* <Typography sx={{fontSize: "18px"}}>{ this.state.teamRatingData[currentTeamTab]["description"] }</Typography> */}

                                <Box sx={{display:"flex" , justifyContent:"center"}}>
                                    {/* <Rating
                                        navbar={this.props.navbar}
                                        rating={teamRatingData[currentTeamTab].rating}
                                    /> */}
                                </Box>
                            </Box>

                            <Box className="assessment-card" >
                                <h5>Observable Characteristics</h5>

                                <Box className="checkbox-spacing">
                                    {observableCharacteristicList}
                                </Box>
                            </Box>

                            {/* {rating["show_suggestions"] &&
                                <Box className="assessment-card">

                                    <h5>Suggestions For Improvement</h5>

                                    <Box className="checkbox-spacing">
                                        {suggestionList}
                                    </Box>
                                </Box>
                            } */}

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