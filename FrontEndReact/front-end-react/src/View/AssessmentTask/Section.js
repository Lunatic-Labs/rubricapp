import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Rating from './Rating';
import ObservableCharacteristic from './ObservableCharacteristic';
import Suggestion from './Suggestion';

class Section extends Component {
    componentDidMount() {
        const button = document.getElementById("formSubmitButton");
        button.addEventListener("click", (event) => {
            event.preventDefault();
            var category = document.getElementsByClassName("activeCategory")[0].getAttribute("name");
            console.log(category);
            var sliderValue = document.getElementById("sliderInput").value;
            var allObservables = document.getElementsByClassName("observable");
            var observables = [];
            for(var o = 0; o < allObservables.length; o++) {
                if(allObservables[o].checked) {
                    observables.push({"name": allObservables[o].id, "desc": allObservables[o].name});
                }
            }
            var allSuggestions = document.getElementsByClassName("suggestion");
            var suggestions = [];
            for(var s = 0; s < allSuggestions.length; s++) {
                if(allSuggestions[s].checked) {
                    suggestions.push({"name": allSuggestions[s].id, "desc": allSuggestions[s].name});
                }
            }
            var comment = document.getElementById("comment").value;
            if(comment==="") {
                comment = null;
            }
            console.log(sliderValue);
            console.log(observables);
            console.log(suggestions);
            console.log(comment);
        });
    }
    render() {
        var section = this.props.section;
        var rating = section[0];
        var observableCharacteristics = section[1];
        var suggestion = section[2];
        var ratings = [];
        var observables = [];
        var suggestions = [];
        var count = 0;
        for(var r = 0; r < rating["values"].length; r++) {
            if(count===1 || count===3) {
                ratings.push(<Rating name={count} desc={""} key={count}/>);
                count++;
            }
            var currentRating = rating["values"][r];
            ratings.push(<Rating name={count} desc={currentRating["desc"]} type={rating["type"]} key={count}/>);
            count++;
        }
        for(var o = 0; o < observableCharacteristics["values"].length; o++) {
            var currentObservableCharacteristic = observableCharacteristics["values"][o];
            observables.push(<ObservableCharacteristic observableCharacteristic={currentObservableCharacteristic} key={o}/>)
        }
        for(var s = 0; s < suggestion["values"].length; s++) {
            var currentSuggestion = suggestion["values"][s];
            suggestions.push(<Suggestion suggestion={currentSuggestion} key={s}/>);
        }
        return (
             <React.Fragment>
                 <div id={rating["name"]}>
                    <div style={{"backgroundColor": "#2E8BEF"}} className="main-color mb-3 rounded">
                        <form className="p-2">
                            <div className="test bg-white p-2 m-3 rounded">
                                <h4 className=" p-1 fw-bold">{rating["name"]}</h4>
                                <div>
                                    <div className=" mx-2 px-5">
                                        <label htmlFor="customRange3" className="form-label"></label>
                                        <input id="sliderInput" type="range" className="form-range" min="0" max="5" step="1"/>
                                    </div>
                                    <div className={"p-2 d-flex flex-row justify-content-between"}>
                                        {ratings}
                                    </div>
                                </div>
                            </div>
                            <div className="test bg-white p-2 m-3 rounded">
                                <h4 className=" p-1 fw-bold">{observableCharacteristics["name"]}</h4>
                                {observables}
                            </div>
                            <div className="test bg-white p-2 m-3 rounded">
                                <h4 className=" p-1 fw-bold">{suggestion["name"]}</h4>
                                {suggestions}
                            </div>
                            <div className="test bg-white p-3 m-3 rounded">
                                <h4 className=" p-1 fw-bold">Comment Box</h4>
                                <textarea className="form-control p-3" id="comment" rows="5" placeholder="Leave comments for improvement..."></textarea>
                            </div>
                            <div className="test bg-white p-3 m-3 rounded d-flex justify-content-end">
                                <button id="formSubmitButton" className="bg-white rounded">Save</button>
                            </div>
                        </form> 
                    </div>
                 </div>
            </React.Fragment>
        )
    }
}

export default Section;