import CourseInfo from "./CourseInfo";
import BackButton from "./BackButton";
import BasicTabs from "../Navbar/BasicTabs";
import { Box } from "@mui/material";

export default function MainHeader (props) {
    var navbar = props.navbar;
    var state = navbar.state;
    return (
            <>
                <BackButton setNewTab={navbar.setNewTab}/>
                <Box className="content-spacing">
                <CourseInfo 
                    courseTitle={state.chosenCourse["course_name"]} 
                    courseNumber={state.chosenCourse["course_number"]}/>
                <BasicTabs 
                    navbar={navbar}
                />
                </Box>
            </>
    )
}

