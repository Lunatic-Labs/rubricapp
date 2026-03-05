import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';



export default function TabManager (props: any) {
  var idTab = props.activeTab==="Users"? 0 : (props.activeTab==="Teams" ? 1 : (props.activeTab==="AssessmentTasks") ? 2 : 0);

  const [value, setValue] = React.useState(idTab);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <Box className="tab-colors">
      <Tabs 
        value={value} 
        onChange={handleChange} 
        centered
        sx={{
            '& .MuiTab-root': {
              color: 'var(--tab-text)',
              textTransform: 'uppercase',
              fontWeight: 450,
            },
            '& .MuiTab-root.Mui-selected': {
              color: 'var(--tab-text-selected)',
              fontWeight: 550,
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--tab-text-selected)',
              height: '2px',
            },
          }}
      >
        <Tab
          label="Assessment Status"

          onClick={() => {
            props.setTab("Assessment Status");
          }}

          aria-label='assessmentStatusTab'
        />

        <Tab
          label="Ratings and Feedback"

          onClick={() => {
            props.setTab("Ratings and Feedback");
          }}

          aria-label='ratingAndFeedbackTab'
        />

        {/* wip */}
        {/* <Tab
          label="Improvement"

          onClick={() => {
            props.setTab("Improvement");
          }}
        /> */}

        {/* wip */}
        {/* <Tab
          label="Calibrations"

          onClick={() => {
            props.setTab("Calibrations");
          }}
        /> */}
      </Tabs>
    </Box>
  );
}