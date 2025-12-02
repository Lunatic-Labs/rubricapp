import { Component } from "react";
import { SPINNER_COLOR, SPINNER_SIZE } from "../../Constants/ButtonSpinner";
import { Box, CircularProgress } from "@mui/material";

/**
 * Displays a centered MUI circular progress spinner that does not have a fixed size.
 * 
 * Props:
 *  @property {number} size - Optional diameter or the spinner in px.
 *  @property {number} thickness - Optional thickness of the spinner.
 * 
 * @example
 *  // Default spinner
 *      <DynamicLoadingSpinner/>
 * 
 *  // Custom size
 *      <DynamicLoadingSpinner size={40}/>
 * 
 *  // Custom size and stroke
 *      <DynamicLoadingSpinner size={50} thickness={70}/>
 */
class DynamicLoadingSpinner extends Component {

    render() {
        const {size = SPINNER_SIZE, thickness = 2} = this.props;

        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    color: SPINNER_COLOR,
                }}>
                    <CircularProgress size={size} thickness={thickness} color="inherit" />
            </Box>
        )
    }
}

export default DynamicLoadingSpinner;