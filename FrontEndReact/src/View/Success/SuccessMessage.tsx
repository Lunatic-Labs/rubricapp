<<<<<<< HEAD
// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, Alert } from '@mui/material';



class SuccessMessage extends Component {
    props: any;
    render() {
        var displayedMessage = this.props.successMessage;

        return(
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center"}}>
                <Alert aria-label='successMessageAlert' sx={{ width: "40%", mt: 2 }} severity="success" variant="filled">
                    { displayedMessage }
                </Alert>
            </Box>
        )
    }
=======
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
>>>>>>> 5b40833d7f48a101e02bae62763a138e667e940b
}

export default SuccessMessage;