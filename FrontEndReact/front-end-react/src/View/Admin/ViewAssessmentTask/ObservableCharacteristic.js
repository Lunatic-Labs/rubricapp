import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ObservableCharacteristic extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: false
        }
    }
    render() {
        var observableCharacteristic = this.props.observableCharacteristic;
        var name = observableCharacteristic["name"];
        var desc = observableCharacteristic["desc"];
        var gray = "#b3b3b3";
        // var gray = "#e6e6e6";
        var blue = "#2E8BEF40";
        return (
            <React.Fragment>
                <div className="d-flex justify-content-start align-items-center input-color text-black rounded m-1" style={{"backgroundColor": this.state.color ? blue:gray}}>
                    <input onClick={()=>{this.setState({color: !this.state.color})}} className="m-2 text-left" style={{"width":"1.25rem", "height":"1.25rem"}} id={name} name={desc} type="checkbox"></input>
                    <label className="form-check-label text-left h3 w-100">
                        {desc}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default ObservableCharacteristic;