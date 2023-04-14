import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class Rating extends Component {
    render() {
        var name = this.props.name;
        var desc = this.props.desc;
        return (
            <React.Fragment>
                <div>
                    <p className="form-check-label">{name} {desc}</p>
                </div>
            </React.Fragment>
        )
    }
}

export default Rating;