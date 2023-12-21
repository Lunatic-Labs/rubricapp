import CourseInfo from "./CourseInfo";
import BackButton from "./BackButton";
import BasicTabs from "../Navbar/BasicTabs";
import { Box } from "@mui/material";

export default function MainHeader (props) {
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    return (
        <>
            <BackButton navbar={navbar}/>
            <Box className="content-spacing">
                <CourseInfo 
                    courseTitle={chosenCourse["course_name"]} 
                    courseNumber={chosenCourse["course_number"]}/>
                <BasicTabs 
                    navbar={navbar}
                />
            </Box>
        </>
    )
}

