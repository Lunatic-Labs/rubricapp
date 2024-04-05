import CourseInfo from "./CourseInfo.js";
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource.js";
import TabManager from "../Admin/View/Reporting/ReportTabs.js";



export default function ReportingMainHeader (props) {
    var navbar = props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    return (
        <>
            <BackButtonResource
                navbar={navbar}
                tabSelected={"User"}
            />

            <Box className="content-spacing">
                <CourseInfo
                    courseTitle={chosenCourse["course_name"]}
                    courseNumber={chosenCourse["course_number"]}
                    courseTerm={chosenCourse["term"]}
                    courseYear={chosenCourse["year"]}
                />

                <TabManager
                    setTab={props.setTab}
                    navbar={navbar}
                />
            </Box>
        </>
    )
}