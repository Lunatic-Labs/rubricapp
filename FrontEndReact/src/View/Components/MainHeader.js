import CourseInfo from "./CourseInfo";
import BackButton from "./BackButton";
import BasicTabs from "../Navbar/BasicTabs";
import { Box } from "@mui/material";

export default function MainHeader (props) {
        return (
        <>
            <BackButton setNewTab={props.setNewTab}/>
            <Box className="content-spacing">
            <CourseInfo 
                courseTitle={props.course} 
                courseNumber={props.number}/>
            <BasicTabs 
                setNewTab={props.setNewTab} 
                activeTab={props.activeTab}
            />
            </Box>
        </>
        )
}

