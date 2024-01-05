import { Box, Chip } from "@mui/material";
import React from "react";
import BackButtonResource from "./BackButtonResource";
import InfoChip from "./InfoChip";

export default function StudentNavigation (props){
    var navbar = props.navbar;
    var tabSelected = props.tabSelected
    // console.log(navbar)
    // // var state = navbar.state;
    // const courseInfo = `${chosenCourse["term"]} ${chosenCourse["year"]} ${chosenCourse["course_name"]} - ${chosenCourse["course_number"]}`;

    return (
        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <BackButtonResource
                navbar={navbar}
                tabSelected={tabSelected}
            />
            <InfoChip navbar={navbar}/>
        </Box>
    );
}
