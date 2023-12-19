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

  render() {
    var navbar = this.props.navbar;
    var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
    
    var readOnly = completeAssessmentTaskReadOnly.readOnly;

    const handleChange = () => {
      if (!readOnly) {
        this.setState((prevState) => ({
          checked: !prevState.checked,
        }));

        var new_data = "";
        for (var i = 0; i < this.props.observableCharacteristics.length; i++) {
          new_data += i === this.props.id ? (this.props.observableCharacteristics[i] === "0" ? "1" : "0") : this.props.observableCharacteristics[i];
        }

        this.props.setObservable_characteristics(this.props.categoryName, new_data);
      }
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
            name={this.props.observableCharacteristic["observable_characteristic_text"]}
            checked={this.state.checked}
            readOnly
            disabled={readOnly}
          />
          <label>{this.props.observableCharacteristic["observable_characteristic_text"]}</label>
        </Box>
      </React.Fragment>
    );
  }
}

export default ObservableCharacteristic;
