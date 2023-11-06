import 'bootstrap/dist/css/bootstrap.css';
import { Box } from "@mui/material";
import Typography from "@mui/material/styles/createTypography";
import React from "react";
// import AdminViewCourses from "../Admin/View/ViewCourses/AdminViewCourses";

export default function MainHeader (props){
    return (
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <h3 style={{fontFamily:"Roboto", fontWeight:"700"}} className=''>{props.course}</h3>
            <h3 style={{fontFamily:"Roboto", fontWeight:"700"}}>&nbsp;-&nbsp;</h3>
            <h3 style={{fontFamily:"Roboto", fontWeight:"700"}} className=''>{props.number}</h3>
        </Box>
    );
}
