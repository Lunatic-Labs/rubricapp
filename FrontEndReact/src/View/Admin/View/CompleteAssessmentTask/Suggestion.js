import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Suggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: this.props.suggestions[this.props.id]==="1",
            clicked: this.props.suggestions[this.props.id]==="1"
        }
    }
    render() {
        var suggestion = this.props.suggestion;
        var suggestionID = suggestion["suggestion_id"];
        var suggestionText = suggestion["suggestion_text"];
        var gray = "#cccccc";
        var blue = "#2E8BEF40";
        return (
            <React.Fragment>
                <div
                    onClick={
                        () => {
                            if(!this.props.readOnly) {
                                this.setState({
                                    color: !this.state.color,
                                    clicked: !this.state.clicked
                                })
                                var new_data = "";
                                for(var i = 0; i < this.props.suggestions.length; i++) {
                                    if(i===this.props.id) {
                                        new_data += this.props.suggestions[i]==="0" ? "1" : "0";
                                    } else {
                                        new_data += this.props.suggestions[i];
                                    }
                                }
                                this.props.setSuggestions(
                                    this.props.category_name,
                                    new_data
                                );
                            }
                        }
                    }
                    className="
                        d-flex
                        justify-content-start
                        align-items-center
                        input-color
                        text-black
                        rounded
                        m-1
                    "
                    style={{
                        "backgroundColor": this.state.color ? blue:gray
                    }}>
                    <input
                        className="
                            m-2
                            text-left
                        "
                        style={{
                            "width":"1.25rem",
                            "height":"1.25rem"
                        }}
                        id={"suggestion"+suggestionID}
                        name={suggestionText}
                        type="checkbox"
                        readOnly
                        checked={this.state.clicked}
                        disabled={this.props.readOnly}
                    ></input>
                    <label
                        className="
                            form-check-label
                            text-left
                            h3
                        "
                        style={{"width":"100%"}}
                    >
                        {suggestionText}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default Suggestion;