import { Box } from "@mui/material";
import React from "react";
import BackButtonResource from "./BackButtonResource";
import InfoChip from "./InfoChip";

interface StudentNavigationProps {
    navbar: any;
    tabSelected: string;
}

export default function StudentNavigation (props: StudentNavigationProps){
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
