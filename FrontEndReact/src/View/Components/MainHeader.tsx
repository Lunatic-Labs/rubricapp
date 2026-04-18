import CourseInfo from "./CourseInfo";
import BasicTabs from "../Navbar/BasicTabs";
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource";

interface MainHeaderProps {
    navbar: any;
}

export default function MainHeader (props: MainHeaderProps) {
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