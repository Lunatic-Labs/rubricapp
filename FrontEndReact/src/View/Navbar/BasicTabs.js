import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';


export default function BasicTabs (props){
   
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab    
                onClick={() => {
                props.setNewTab("Users");
                }}
                label="Roster"  
            />
          <Tab 
                onClick={() => {
                props.setNewTab("Teams")
                }}
                label="Teams" 
            />
          <Tab 
                onClick={() => {
                    // this.setNewTab("Complete Assessment Task");
                props.setNewTab("AssessmentTasks");
                }}
                label="Assessment Task"  
            />
        </Tabs>
      </Box>
    </Box>
  );
}

