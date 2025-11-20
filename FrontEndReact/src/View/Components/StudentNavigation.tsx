// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from "@mui/material";
// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from "react";
import BackButtonResource from "./BackButtonResource";
import InfoChip from "./InfoChip";

export default function StudentNavigation (props: any){
    var navbar = props.navbar;
    var tabSelected = props.tabSelected;

    return (
        // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
        <Box sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <BackButtonResource
                navbar={navbar}
                tabSelected={tabSelected}
            />

            <InfoChip navbar={navbar}/>
        </Box>
    );
}
