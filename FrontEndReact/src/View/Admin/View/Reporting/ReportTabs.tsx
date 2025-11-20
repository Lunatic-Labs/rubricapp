// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import * as React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Tabs' or its cor... Remove this comment to see the full error message
import Tabs from '@mui/material/Tabs';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Tab' or its corr... Remove this comment to see the full error message
import Tab from '@mui/material/Tab';



export default function TabManager (props: any) {
  var idTab = props.activeTab==="Users"? 0 : (props.activeTab==="Teams" ? 1 : (props.activeTab==="AssessmentTasks") ? 2 : 0);

  const [value, setValue] = React.useState(idTab);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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