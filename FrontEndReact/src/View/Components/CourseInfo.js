import { Box } from "@mui/material";
import React from "react";

export default function CourseInfo (props){
    return (
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <h3>{props.courseTitle}</h3>
            <h3>&nbsp;-&nbsp;</h3>
            <h3>{props.courseNumber}</h3>
        </Box>
    );
}
