import { Box } from "@mui/material";
import React from "react";
import BackButtonResource from "./BackButtonResource";
import InfoChip from "./InfoChip";

export default function StudentNavigation (props){
    var navbar = props.navbar;
    var tabSelected = props.tabSelected;

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
