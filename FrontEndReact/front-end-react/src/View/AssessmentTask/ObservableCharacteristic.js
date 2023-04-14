import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ObservableCharacteristic extends Component {
    render() {
        var observableCharacteristic = this.props.observableCharacteristic;
        var name = observableCharacteristic["name"];
        var desc = observableCharacteristic["desc"];
        return (
            <React.Fragment>
                <div>
                    <div className=" input-color m-3 p-2 rounded text-black" style={{"backgroundColor": "#2E8BEF40"}}>
                        <input className="observable m-3" id={name} name={desc} type="checkbox" value=""></input>
                        <label className="form-check-label">
                            {desc}
                        </label>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ObservableCharacteristic;