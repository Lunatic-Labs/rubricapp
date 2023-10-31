import React from "react";
//import "./App.css"";
import ViewReportNavApp from "../Components/ViewReportNavApp";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import ViewAssessmentStatus from "../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewAssessmentStatus"
import ViewRatingsAndFeedback from "../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewRatingsAndFeedback";
import ViewCalibration from "../Admin/View/Reporting/Feedback//ReportingNavbar/Pages/ViewCalibration";
import ViewImprovement from "../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewImprovement";

 
function ViewReportNavApp() {
    return (
        <Router>
            <ViewReportNav />
            <Routes>
                <Route path="/ViewAssessmentStatus" element={<ViewAssessmentStatus />}/>
                <Route path="/ViewRatingsAndFeedback" element={<ViewRatingsAndFeedback />}/>
                <Route path="/ViewCalibration" element={<ViewCalibration />}/>
                <Route path="/ViewImprovement" element={<ViewImprovement />}/>
            </Routes>
        </Router>
    );
}
 
export default ViewReportNavApp;