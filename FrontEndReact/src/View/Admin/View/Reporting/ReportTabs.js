import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';



export default function TabManager (props) {
  var idTab = props.activeTab==="Users"? 0 : (props.activeTab==="Teams" ? 1 : (props.activeTab==="AssessmentTasks") ? 2 : 0);

  const [value, setValue] = React.useState(idTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Tabs value={value} onChange={handleChange} centered>
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
  );
}