import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';



class Suggestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.suggestions[this.props.id] === "1"
        };
    }

    componentDidUpdate() {
        if ((this.props.suggestions[this.props.id] === "1") !== this.state.checked) {
            this.setState({
                checked: this.props.suggestions[this.props.id] === "1"
            });
        }
    }

    render() {
        const handleChange = () => {
            if (this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly) return;
            
            this.setState((prevState) => ({
                checked: !prevState.checked,
            }));

            var newData = "";

            for (var i = 0; i < this.props.suggestions.length; i++) {
                newData += i === this.props.id ? (this.props.suggestions[i] === "0" ? "1" : "0") : this.props.suggestions[i];
            }

            this.props.setSuggestions(newData);
            
            this.props.autosave();
        };

        return (
            <Box
                className="checkbox-alignment"

                style={{ backgroundColor: this.state.checked ? "#ADCBEE" : "#D9D9D9" }}

                onClick={handleChange}

                disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
            >
                <Checkbox
                    sx={{
                        p: 2,
                        width: "1.25rem",
                        height: "1.25rem",
                        color: this.state.checked ? "#2E8BEF !important" : "none",
                    }}

                    name={this.props.suggestion}

                    checked={this.state.checked}

                    disabled={this.props.navbar.state.chosenCompleteAssessmentTaskIsReadOnly}
                />

                <label>{this.props.suggestion}</label>
            </Box>
        );
    }
}

export default Suggestion;