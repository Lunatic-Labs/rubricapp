import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function BasicTabs (props){
  var navbar = props.navbar;
  var state = navbar.state;
  var activeTab = state.activeTab;
  var setNewTab = navbar.setNewTab;
  var idTab = activeTab==="Users"? 0 : (activeTab==="Teams" ? 1 : (activeTab==="AssessmentTasks") ? 2 : 0);
  const [value, setValue] = React.useState(idTab);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box>
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
                onClick={() => {
                 setNewTab("Users");
                }}
                label="Roster" 
            />
          <Tab 
                onClick={() => {
                 setNewTab("Teams")
                }}
                label="Teams" 
            />
          <Tab 
                onClick={() => {
                  setNewTab("AssessmentTasks");
                }}
                label="Assessment Task"  
            />
        </Tabs>
      </Box>
    </Box>
  );
}

