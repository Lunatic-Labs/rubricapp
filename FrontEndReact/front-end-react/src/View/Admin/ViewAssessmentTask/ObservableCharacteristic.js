import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ObservableCharacteristic extends Component {
    render() {
        var observableCharacteristic = this.props.observableCharacteristic;
        var name = observableCharacteristic["name"];
        var desc = observableCharacteristic["desc"];
        return (
            <React.Fragment>
                {/* <div className="d-flex align-items-center input-color m-3 p-2 rounded text-black" style={{"backgroundColor": "#2E8BEF40"}}> */}
                {/* <div className="d-flex align-items-center input-color m-3 p-2 rounded text-black" > */}
                <div className="d-flex justify-content-start align-items-center input-color rounded text-black" >
                    {/* Added m-2 to show customers */}
                    <input className="observable m-2" id={name} name={desc} type="checkbox" value="" style={{textAlign: "left", width: "auto",}}></input>
                    {/* Added m-2 to show customers, h3, and textAligh: "left" */}
                    <label className="form-check-label h3 m-2" style={{textAlign: "left", width: "auto",}}>
                        {desc}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default ObservableCharacteristic;