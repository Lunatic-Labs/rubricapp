import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';



class ObservableCharacteristic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: this.props.observableCharacteristics[this.props.id] === "1"
    };
  }

  componentDidUpdate() {
    if((this.props.observableCharacteristics[this.props.id] === "1") !== this.state.checked) {
      this.setState({
        checked: this.props.observableCharacteristics[this.props.id] === "1"
      });
    }
  }

  render() {
    const handleChange = () => {
      this.setState((prevState) => ({
        checked: !prevState.checked,
      }));

      var newData = "";
      for (var i = 0; i < this.props.observableCharacteristics.length; i++) {
        newData += i === this.props.id ? (this.props.observableCharacteristics[i] === "0" ? "1" : "0") : this.props.observableCharacteristics[i];
      }

      this.props.setObservableCharacteristics(
        this.props.unitValue,
        this.props.categoryName,
        newData
      );
    };

    return (
      <Box
        className="checkbox-alignment"

        style={{ backgroundColor: this.state.checked ? "#ADCBEE" : "#D9D9D9" }}

        onClick={handleChange}

        disabled={this.props.isUnitCompleteAssessmentComplete(this.props.unitValue)}
      >
        <Checkbox
          sx={{
            p: 2,
            width: "1.25rem",
            height: "1.25rem",
            color: this.state.checked ? "#2E8BEF !important" : "none",
          }}

          name={this.props.observableCharacteristic}

          checked={this.state.checked}

          disabled={this.props.isUnitCompleteAssessmentComplete(this.props.unitValue)}
        />

        <label>{this.props.observableCharacteristic}</label>
      </Box>
    );
  }
}

export default ObservableCharacteristic;
