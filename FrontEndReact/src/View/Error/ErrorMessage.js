import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';

class ErrorMessage extends Component {
    render() {
        return(
            <h1 className='alert alert-danger h3 p-3 mt-3' role="alert">
                {
                    this.props.errorMessage ?
                    (
                        this.props.fetchedResource ?
                        "Fetching " + this.props.fetchedResource :
                        (
                            this.props.add ?
                            "Creating a new " :
                            "Updating a new "
                        )
                        + this.props.resource
                    )
                    + " resulted in an error: "+ this.props.errorMessage :
                    this.props.error
                }
            </h1>
        )
    }
}

export default ErrorMessage;