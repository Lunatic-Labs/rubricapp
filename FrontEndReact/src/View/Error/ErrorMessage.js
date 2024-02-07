import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';



class ErrorMessage extends Component {
    render() {
        if (Object.hasOwn(this.props, 'fetchedResource')) {
            return(
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                    <Alert aria-label='error_message_alert' sx={{ width: "40%", mt: 2, position:"absolute" }} severity="error" variant="filled">
                        {
                            (
                                this.props.fetchedResource ?
                                "Fetching " + this.props.fetchedResource :
                                ( this.props.add ? "Creating a new " : "Updating a new ") + this.props.resource + " resulted in an error: "
                            )

                            + ": " + this.props.errorMessage
                        }
                    </Alert>
                </Box>
            )

        } else {
            return(
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                   <Alert aria-label='error_message_alert' sx={{ width: "40%", mt: 2, position:"absolute" }} severity="error" variant="filled">
                        { this.props.errorMessage }
                    </Alert>
              </Box>
            )
        }
    }
}

export default ErrorMessage;