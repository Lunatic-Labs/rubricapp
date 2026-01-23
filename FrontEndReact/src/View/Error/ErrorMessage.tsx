import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';

type ErrorMessageProps = { errorMessage: string };

class ErrorMessage extends Component<ErrorMessageProps> {
    render() {
        var displayedMessage: any = this.props.errorMessage;
        
        // Convert Error objects to strings
        if (displayedMessage instanceof Error) {
            displayedMessage = displayedMessage.message || displayedMessage.toString();
        } else if (typeof displayedMessage === 'object' && displayedMessage !== null) {
            // Handle other objects (like API error responses)
            displayedMessage = displayedMessage.message || JSON.stringify(displayedMessage);
        } else if (!displayedMessage) {
            displayedMessage = "An unknown error occurred";
        }
        
        // Ensure it's a string
        displayedMessage = String(displayedMessage);

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