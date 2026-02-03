import { Component } from "react";
import { Box, CircularProgress } from "@mui/material";

/**
 * Displays a centered MUI circular progress spinner that has a fixed 125 px diameter.
 * 
 * @example
 *  // Default spinner
 *      <Loading/>
 */
class Loading extends Component {
    render() {
        return(
            <Box sx={{
                width: "100%",
                height: "100%",
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