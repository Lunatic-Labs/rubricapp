import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Box, Alert } from '@mui/material';

interface Props {
  successMessage: string;
}

class SuccessMessage extends Component<Props> {
  render() {
    const displayedMessage = this.props.successMessage;
    return(
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
        <Alert aria-label='successMessageAlert' sx={{ width: "40%", mt: 2 }} severity="success" variant="filled">
          { displayedMessage }
        </Alert>
      </Box>
    )
  }
}

export default SuccessMessage;