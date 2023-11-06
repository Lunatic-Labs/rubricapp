import { Box } from "@mui/material";
import React from "react";

export default function MainHeader (props){
    return (
        <Box sx={{display:"flex", flexDirection:"row"}}>
            <h3>{props.course}</h3>
            <h3>&nbsp;-&nbsp;</h3>
            <h3>{props.number}</h3>
        </Box>
    );
}
