import { Box } from "@mui/material";
import React from "react";

interface CourseInfoProps {
    courseTitle?: string;
    courseNumber?: string | number;
    courseTerm?: string;
    courseYear?: string | number;
}

export default function CourseInfo (props: CourseInfoProps){
    return (
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <h4>{props.courseTitle}</h4>
            <h4>&nbsp;-&nbsp;</h4>
            <h4>{props.courseNumber}</h4>
            <h4>&nbsp;&nbsp;</h4>
            <h4>{props.courseTerm}</h4>
            <h4>&nbsp;&nbsp;</h4>
            <h4>{props.courseYear}</h4>
        </Box>
    );
}
