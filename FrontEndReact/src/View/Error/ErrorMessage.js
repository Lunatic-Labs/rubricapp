import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';



class ErrorMessage extends Component {
    render() {
        var displayedMessage;

        if (Object.hasOwn(this.props, 'fetchedResource')) {
            var message;

            if (this.props.fetchedResource) {
                message = `Fetching ${this.props.fetchedResource}`;

            } else {
                var method;

                if (this.props.add) {
                    method = "Creating a new ";

                } else {
                    method = "Updating an existing ";
                }

                message = `${method} ${this.props.resource} resulted in an error`;
            }

            displayedMessage = `${message}: ${this.props.errorMessage}`;

        } else {
            displayedMessage = this.props.errorMessage;
        }

        return(
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                <Alert aria-label='error_message_alert' sx={{ width: "40%", mt: 2, position:"absolute" }} severity="error" variant="filled">
                    { displayedMessage }
                </Alert>
            </Box>
        )
    }
}

export default ErrorMessage;