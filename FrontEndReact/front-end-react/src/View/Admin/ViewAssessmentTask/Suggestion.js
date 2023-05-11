import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Suggestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: false
        }
    }
    render() {
        var suggestion = this.props.suggestion;
        var name = suggestion["name"];
        var desc = suggestion["desc"];
        var gray = "#e6e6e6";
        var blue = "#2E8BEF40";
        return (
            <React.Fragment>
                <div className="d-flex justify-content-start align-items-center input-color text-black rounded m-1" style={{"backgroundColor": this.state.color ? blue:gray}}>
                    <input onClick={() => {this.setState({color: !this.state.color})}} className="m-2 text-left" style={{"width":"1.25rem", "height":"1.25rem"}} id={name} name={desc} type="checkbox"></input>
                    <label className="form-check-label text-left h3" style={{"width":"100%"}}>
                        {desc}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default Suggestion;