import React, { Component } from 'react';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';

class ObservableCharacteristic extends Component {
  constructor(props) {
    super(props);
    var navbar = this.props.navbar;
    var observableCharacteristicComponent = navbar.observableCharacteristicComponent;
    var observable_characteristics = observableCharacteristicComponent.observable_characteristics;
    var id = observableCharacteristicComponent.id;
    this.state = {
      checked: observable_characteristics[id] === "1",
    };
  }

  render() {
    var navbar = this.props.navbar;
    var observableCharacteristicComponent = navbar.observableCharacteristicComponent;
    var observableCharacteristic = observableCharacteristicComponent.observableCharacteristic;
    var completeAssessmentTaskReadOnly = navbar.completeAssessmentTaskReadOnly;
    
    var readOnly = completeAssessmentTaskReadOnly.readOnly;
    var observable_characteristics = observableCharacteristicComponent.observable_characteristics;
    var id = observableCharacteristicComponent.id;
    var setObservable_characteristics = observableCharacteristicComponent.setObservable_characteristics;
    var category_name = observableCharacteristicComponent.category_name;

    var observableCharacteristicID = observableCharacteristic["observable_characteristic_id"];
    var description = observableCharacteristic["observable_characteristic_text"];

    const handleChange = () => {
      if (!readOnly) {
        this.setState((prevState) => ({
          checked: !prevState.checked,
        }));

        var new_data = "";
        for (var i = 0; i < observable_characteristics.length; i++) {
          new_data += i === id ? (observable_characteristics[i] === "0" ? "1" : "0") : observable_characteristics[i];
        }

        setObservable_characteristics(category_name, new_data);
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
            id={'oc' + observableCharacteristicID}
            name={description}
            checked={this.state.checked}
            readOnly
            disabled={readOnly}
          />
          <label>{description}</label>
        </Box>
      </React.Fragment>
    );
  }
}

export default ObservableCharacteristic;
