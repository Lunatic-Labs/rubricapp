// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import { Component } from "react";
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, CircularProgress } from "@mui/material";



class Loading extends Component {
    render() {
        return(
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
            <Box sx={{
                width: "100%",
                heigh: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "16%",
                color: "#2E8BEF"
            }}>
                <CircularProgress size={125} thickness={2} color="inherit" />
            </Box>
        )
    }
};

export default Loading;