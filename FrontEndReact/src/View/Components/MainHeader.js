import CourseInfo from "./CourseInfo.js";
import BasicTabs from "../Navbar/BasicTabs.js";
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource.js";



export default function MainHeader (props) {
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    return (
        <>
            <BackButtonResource
                navbar={navbar}
                tabSelected={"Course"}
            />

            <Box className="content-spacing" aria-label="viewCourseMainHeader">
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