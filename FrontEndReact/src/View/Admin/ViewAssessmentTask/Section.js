import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';
import Rating from './Rating';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

class Section extends Component {
    // componentDidMount() {
    //     const button = document.getElementById("formSubmitButton");
    //     button.addEventListener("click", (event) => {
    //         event.preventDefault();
    //         // var category = document.getElementsByClassName("activeCategory")[0].getAttribute("name");
    //         // console.log(category);
    //         // var sliderValue = document.getElementById("sliderInput").value;
    //         var allObservables = document.getElementsByClassName("observable");
    //         var observables = [];
    //         for(var o = 0; o < allObservables.length; o++) {
    //             if(allObservables[o].checked) {
    //                 observables.push({"name": allObservables[o].id, "desc": allObservables[o].name});
    //             }
    //         }
    //         var allSuggestions = document.getElementsByClassName("suggestion");
    //         var suggestions = [];
    //         for(var s = 0; s < allSuggestions.length; s++) {
    //             if(allSuggestions[s].checked) {
    //                 suggestions.push({"name": allSuggestions[s].id, "desc": allSuggestions[s].name});
    //             }
    //         }
    //         var comment = document.getElementById("comment").value;
    //         if(comment==="") {
    //             comment = null;
    //         }
    //         // console.log(sliderValue);
    //         // console.log(observables);
    //         // console.log(suggestions);
    //         // console.log(comment);
    //     });
    // }
    render() {
        var section = this.props.section;
        var rating = section["category_ratings"];
        var observableCharacteristics = section["observable_characteristics"];
        var suggestions = section["suggestions"];
        var sliderValues = [
            {
                value: 0,
                label: "No evidence",
                key: 0
            },
            {
                value: 1,
                label: "Minimally",
                key: 1
            },
            {
                value: 2,
                label: "",
            },
            {
                value: 3,
                label: "Partially",
                key: 2
            },
            {
                value: 4,
                label: ""
            },
            {
                value: 5,
                label: "Completely",
                key: 3
            }
        ];
        var observableCharacteristicList = [];
        for(var o = 0; o < observableCharacteristics.length; o++) {
            var currentObservableCharacteristic = observableCharacteristics[o];
            observableCharacteristicList.push(<ObservableCharacteristic observableCharacteristic={currentObservableCharacteristic} key={o}/>)
        }
        var suggestionList = [];
        for(var s = 0; s < suggestions.length; s++) {
            var currentSuggestion = suggestions[s];
            suggestionList.push(<Suggestion suggestion={currentSuggestion} key={s}/>);
        }
        return (
             <React.Fragment>
                 <div id={rating["name"]}>
                    <div style={{"backgroundColor":"#6daef4", "borderRadius" : "0px 10px 10px 10px"}} className="main-color">
                        <form className="p-2">
                            <div className="bg-white p-2 m-3 rounded">
                                <h4 className="p-1 h3 fw-bold">{rating["name"]}</h4>
                                 <Box sx={{display:"flex" , justifyContent:"center"}}>
                                    <Rating data={sliderValues}/>
                                 </Box>
                            </div>
                            <div className="test bg-white p-2 m-3 rounded" >
                                <h4 className="h3 p-1 fw-bold">Observable Characteristics</h4>
                                <div>
                                    {observableCharacteristicList}
                                </div>
                            </div>
                            <div className="test bg-white p-2 m-3 rounded">
                                <h4 className="h3 p-1 fw-bold">Suggestions For Improvement</h4>
                                <div>
                                    {suggestionList}
                                </div>
                            </div>
                            <div className="test bg-white p-3 m-3 rounded">
                                <h4 className="p-1 h3 fw-bold">Comment Box</h4>
                                <textarea className="form-control h3 p-3" id="comment" rows="5" placeholder="Leave comments for improvement..."></textarea>
                            </div>
                            <div className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <Button id="formSubmitButton" className="bg-white rounded">Submit Assessment</Button>
                            </div>
                        </form> 
                    </div>
                 </div>
            </React.Fragment>
        )
    }
}

export default Section;