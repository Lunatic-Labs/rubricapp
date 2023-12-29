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
    if((this.props.suggestions[this.props.id] === "1") !== this.state.checked) {
      this.setState({
        checked: this.props.suggestions[this.props.id] === "1"
      });
    }
  }

  render() {
    const handleChange = () => {
      this.setState((prevState) => ({
        checked: !prevState.checked,
      }));

      var new_data = "";
      for (var i = 0; i < this.props.suggestions.length; i++) {
        new_data += i === this.props.id ? (this.props.suggestions[i] === "0" ? "1" : "0") : this.props.suggestions[i];
      }

      this.props.setSuggestions(
        this.props.teamValue,
        this.props.categoryName,
        new_data
      );
    };

    return (
      <React.Fragment>
        <Box
          onClick={handleChange}
          className="checkbox-alignment"
          style={{
            backgroundColor: this.state.checked ? "#ADCBEE" : "#D9D9D9",
          }}
        >
          <Checkbox
            sx={{
              p: 2,
              width: "1.25rem",
              height: "1.25rem",
              color: this.state.checked ? "#2E8BEF !important" : "none",
            }}
            checked={this.state.checked}
            name={this.props.suggestion}
          />
          <label>{this.props.suggestion}</label>
        </Box>
      </React.Fragment>
    );
  }
}

export default Suggestion;