import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ObservableCharacteristic extends Component {
    constructor(props) {
        super(props);
        var navbar = this.props.navbar;
        var observableCharacteristicComponent = navbar.observableCharacteristicComponent;
        var observable_characteristics = observableCharacteristicComponent.observable_characteristics;
        var id = observableCharacteristicComponent.id;
        this.state = {
            color: observable_characteristics[id]==="1",
            clicked: observable_characteristics[id]==="1"
        }
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

        var gray = "#cccccc";
        var blue = "#2E8BEF40";
        return (
            <React.Fragment>
                <div
                    onClick={
                        () => {
                            if(!readOnly) {
                                this.setState({
                                    color: !this.state.color,
                                    clicked: !this.state.clicked
                                })
                                var new_data = "";
                                for(var i = 0; i < observable_characteristics.length; i++) {
                                    if(i===id) {
                                        new_data += observable_characteristics[i]==="0" ? "1" : "0";
                                    } else {
                                        new_data += observable_characteristics[i];
                                    }
                                }
                                setObservable_characteristics(
                                    category_name,
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
                        rounded m-1
                    "
                    style={{"backgroundColor": this.state.color ? blue : gray}
                }>
                    <input
                        className="m-2 text-left"
                        style={{
                            "width":"1.25rem",
                            "height":"1.25rem"
                        }}
                        id={"oc"+observableCharacteristicID}
                        name={description}
                        type="checkbox"
                        readOnly
                        checked={this.state.clicked}
                        disabled={readOnly}
                    ></input>
                    <label
                        className="form-check-label text-left h3 w-100"
                    >
                        {description}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default ObservableCharacteristic;