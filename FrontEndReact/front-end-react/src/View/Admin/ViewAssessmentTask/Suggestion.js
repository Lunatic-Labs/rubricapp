import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Suggestion extends Component {
    render() {
        var suggestion = this.props.suggestion;
        var name = suggestion["name"];
        var desc = suggestion["desc"];
        return (
            <React.Fragment>
                <div className="d-flex align-items-center input-color m-3 p-2 rounded text-black" style={{"backgroundColor": "#2E8BEF40", textAlign: "left", width: "auto"}}>
                    <input className=" suggestion m-3" id={name} name={desc} type="checkbox" value="" style={{textAlign: "left", width: "auto"}}></input>
                    <label className="form-check-label" style={{textAlign: "left", width: "auto"}}>
                        {desc}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default Suggestion;