import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import ViewAssessmentStatus from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewAssessmentStatus.js';
// import ViewRatingsAndFeedback from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewRatingsAndFeedback.js'
// import ViewImprovement from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewImprovement.js'
// import ViewCalibrations from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewCalibrations.js'

  export default function TabManager (props) {
    var idTab = props.activeTab==="Users"? 0 : (props.activeTab==="Teams" ? 1 : (props.activeTab==="AssessmentTasks") ? 2 : 0);
    const [value, setValue] = React.useState(idTab);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
  
    return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Assesment Status" 
            onClick={() => {
                props.setTab("Assessment Status") 
                }} />
          <Tab label="Ratings and Feedback"     
            onClick={() => {
                props.setTab("Ratings and Feedback");
                }} />
          <Tab label="Improvement"      
            onClick={() => {
                props.setTab("Improvement") }} />
          <Tab label="Calibrations"     
            onClick={() => {
                props.setTab("Calibrations") }} />
        </Tabs>
      </Box>
    );
  }