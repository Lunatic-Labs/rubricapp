import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Rating extends Component {
    render() {
        var name = this.props.name;
        var desc = this.props.desc;
        return (
            <React.Fragment>
                <div style={{width:"10rem"}}>
                    <p className="form-check-label ">{name}</p>
                    <p className="form-check-label ">{desc}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Rating;