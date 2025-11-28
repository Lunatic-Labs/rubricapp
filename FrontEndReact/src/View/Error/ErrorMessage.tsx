import React, { Component } from 'react';
// @ts-ignore: allow importing CSS without type declarations
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';

type ErrorMessageProps = { errorMessage: string };

class ErrorMessage extends Component<ErrorMessageProps> {
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