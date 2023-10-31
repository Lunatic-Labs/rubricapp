import React from "react";
import ReactDOM from "react-dom/client";
import "../Components/ReportNavIndex.js";
import ReportNavApp from "../Admin/View/Reporting/ReportingNavApp.js";
 
const root = ReactDOM.createRoot(
    document.getElementById("root")
);
root.render(
    <React.StrictMode>
        <ReportNavApp />
    </React.StrictMode>
);