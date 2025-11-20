// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, Chip } from "@mui/material";
// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from "react";



export default function InfoChip (props: any){
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    const courseInfo = `${chosenCourse["term"]} ${chosenCourse["year"]} ${chosenCourse["course_name"]} - ${chosenCourse["course_number"]}`;

    return (
        // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <Chip sx={{borderColor:"#2E8BEF", color:"#2E8BEF", height:"36px"}}label={courseInfo} variant="outlined" />
        </Box>
    );
}
