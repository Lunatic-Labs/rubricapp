import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';


/**
 * Creates an instance of the ErrorMessage component
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @param {string|null} props.errorMessage - The error message text to display, if null or empty, the component still renders but displays no content.
 */

class ErrorMessage extends Component {
    render() {
        var displayedMessage = this.props.errorMessage;

        return(
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                <Alert aria-label='errorMessageAlert' sx={{ width: "40%", mt: 2, position:"absolute" }} severity="error" variant="filled">
                    { displayedMessage }
                </Alert>
            </Box>
        )
    }
}

export default ErrorMessage;