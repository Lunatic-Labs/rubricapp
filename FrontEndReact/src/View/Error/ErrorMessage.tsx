import React, { Component } from 'react';
import { Box, Alert } from '@mui/material';

interface Props {
  errorMessage: string;
}

class ErrorMessage extends Component<Props> {
  render() {
    const displayedMessage = this.props.errorMessage;
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