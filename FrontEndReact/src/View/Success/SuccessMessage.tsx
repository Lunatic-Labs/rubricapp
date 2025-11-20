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
}

export default SuccessMessage;