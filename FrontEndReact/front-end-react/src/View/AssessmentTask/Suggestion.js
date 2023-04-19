import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Suggestion extends Component {
    render() {
        var suggestion = this.props.suggestion;
        var name = suggestion["name"];
        var desc = suggestion["desc"];
        return (
            <React.Fragment>
                <div className="d-flex align-items-center input-color m-3 p-2 rounded text-black" style={{"backgroundColor": "#2E8BEF40"}}>
                    <input className=" suggestion m-3" id={name} name={desc} type="checkbox" value=""></input>
                    <label className="form-check-label">
                        {desc}
                    </label>
                </div>
            </React.Fragment>
        )
    }
}

export default Suggestion;