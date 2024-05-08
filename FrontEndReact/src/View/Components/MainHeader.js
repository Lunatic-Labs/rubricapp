import CourseInfo from "./CourseInfo.js";
import BasicTabs from "../Navbar/BasicTabs.js";
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource.js";



export default function MainHeader (props) {
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    console.log(navbar);

    return (
        <>
            <BackButtonResource
                navbar={navbar}
                tabSelected={"Course"}
                aria-label="mainHeaderBackButton"
            />

            <Box className="content-spacing">
                <CourseInfo
                    courseTitle={chosenCourse["course_name"]} 
                    courseNumber={chosenCourse["course_number"]}
                    aria-label={chosenCourse["course_name"]}
                />

                <BasicTabs
                    navbar={navbar}
                />
            </Box>
        </>
    )
}