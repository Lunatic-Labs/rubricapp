import { Component } from "react";
import { Box, CircularProgress } from "@mui/material";



class Loading extends Component {
    render() {
        return(
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