import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ObservableCharacteristic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: false,
            clicked: false
        }
    }
    render() {
        var observableCharacteristic = this.props.observableCharacteristic;
        var description = observableCharacteristic["observable_characteristic_text"];
        var observableCharacteristicID = observableCharacteristic["observable_characteristic_id"];
        var gray = "#cccccc";
        var blue = "#2E8BEF40";
        return (
            <React.Fragment>
                <div
                    onClick={
                        () => {
                            this.setState({
                                color: !this.state.color,
                                clicked: !this.state.clicked
                            })
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
                    style={{"backgroundColor": this.state.color ? blue:gray}
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