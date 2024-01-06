import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ErrorMessage extends Component {
    render() {
        if (Object.hasOwn(this.props, 'fetchedResource')) {
            return(
                <h1 className='alert alert-danger h3 p-3 mt-3' role="alert">
                    {
                        (
                            this.props.fetchedResource ?
                            "Fetching " + this.props.fetchedResource :
                            ( this.props.add ? "Creating a new " : "Updating a new ") + this.props.resource + " resulted in an error: "
                        )

                        + this.props.errorMessage
                    }
                </h1>
            )
        } else {
            return(
                <h1 className={`alert alert-danger h3 p-3 ${this.props.navbar ? "" : "mt-3"}`} role="alert">
                    { this.props.errorMessage }
                </h1>
            )
        }
        
    }
}

export default ErrorMessage;