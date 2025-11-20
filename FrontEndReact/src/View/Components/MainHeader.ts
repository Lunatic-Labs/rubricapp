import CourseInfo from "./CourseInfo.js";
import BasicTabs from "../Navbar/BasicTabs.js";
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource.js";



export default function MainHeader (props: any) {
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    return (
        <>
            // @ts-expect-error TS(2749): 'BackButtonResource' refers to a value, but is bei... Remove this comment to see the full error message
            <BackButtonResource
                navbar={navbar}
                // @ts-expect-error TS(2304): Cannot find name 'tabSelected'.
                tabSelected={"Course"}
            />

            // @ts-expect-error TS(2304): Cannot find name 'className'.
            <Box className="content-spacing" aria-label="viewCourseMainHeader">
                // @ts-expect-error TS(2749): 'CourseInfo' refers to a value, but is being used ... Remove this comment to see the full error message
                <CourseInfo
                    // @ts-expect-error TS(2304): Cannot find name 'courseTitle'.
                    courseTitle={chosenCourse["course_name"]} 
                    // @ts-expect-error TS(2304): Cannot find name 'courseNumber'.
                    courseNumber={chosenCourse["course_number"]}
                    // @ts-expect-error TS(2304): Cannot find name 'aria'.
                    aria-label={chosenCourse["course_name"]}
                // @ts-expect-error TS(2365): Operator '<' cannot be applied to types 'RegExp' a... Remove this comment to see the full error message
                />

                <BasicTabs
                    // @ts-expect-error TS(2362): The left-hand side of an arithmetic operation must... Remove this comment to see the full error message
                    navbar={navbar}
                />
            </Box>
        </>
    )
}