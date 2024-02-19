import { Box, Chip } from "@mui/material";
import React from "react";



export default function InfoChip (props){
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    const courseInfo = `${chosenCourse["term"]} ${chosenCourse["year"]} ${chosenCourse["course_name"]} - ${chosenCourse["course_number"]}`;

    return (
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Chip sx={{borderColor:"#2E8BEF", color:"#2E8BEF", height:"36px"}}label={courseInfo} variant="outlined" />
        </Box>
    );
}
