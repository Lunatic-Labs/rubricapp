import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ViewAssessmentStatus from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewAssessmentStatus.js';
import ViewRatingsAndFeedback from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewRatingsAndFeedback.js'
import ViewImprovement from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewImprovement.js'
import ViewCalibrations from '../Admin/View/Reporting/Feedback/ReportingNavbar/Pages/ViewCalibrations.js'
import { useState } from 'react';

export default function CenteredTabs() {
  var [tab, setTab] = useState('');
  function samePageLinkNavigation(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 || // ignore everything but left-click
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return false;
    }
    return true;
  }

  function Tab(props) {
    return (
      <Tab
        component="a"
        onClick={(event) => {
          // Routing libraries handle this, you can remove the onClick handle when using them.
          if (samePageLinkNavigation(event)) {
            event.preventDefault();
          }
        }}
        {...props}
      />
    );
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Assesment Status" 
          onClick={() => {
              setTab("ViewAssessmentStatus") }} />
        <Tab label="Ratings and Feedback"     
          onClick={() => {
              setTab("ViewRatingsAndFeedback") }} />
        <Tab label="Improvement"      
          onClick={() => {
              setTab("ViewImprovement") }} />
        <Tab label="Calibrations"     
          onClick={() => {
              setTab("ViewCalibrations") }} />
      </Tabs>
    </Box>
  );
  }