import CourseInfo from "./CourseInfo";
import { Box } from "@mui/material";
import BackButtonResource from "./BackButtonResource";
import TabManager from "../Admin/View/Reporting/ReportTabs";

interface ReportingMainHeaderProps {
    navbar: any;
    setTab: (tab: string) => void;
    activeTab: string;
}

export default function ReportingMainHeader (props: ReportingMainHeaderProps) {
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
                    activeTab={props.activeTab}
                    navbar={navbar}
                />
            </Box>
        </>
    )
}