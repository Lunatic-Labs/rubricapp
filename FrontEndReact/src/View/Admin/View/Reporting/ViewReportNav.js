import React from "react";
import {
    Nav,
    NavLink,
    Bars,
    NavMenu
} from "./Feedback/ReportingNavbar/Components/ReportNavElements";
 
const ViewReportNav = () => {
    return (
        <>
            <Nav>
                <Bars />
 
                <NavMenu>
                    <NavLink to="/ViewRatingsAndFeedback" >
                        Ratings and Feedback
                    </NavLink>
                    <NavLink to="/ViewAssessmentStatus" activeStyle>
                        Assessment Status
                    </NavLink>
                    <NavLink to="/ViewCalibration" activeStyle>
                        Calibration
                    </NavLink>
                    <NavLink to="/ViewImprovement" activeStyle>
                        Improvement
                    </NavLink>
                </NavMenu>
            </Nav>
        </>
    );
};
 
export default ViewReportNav;