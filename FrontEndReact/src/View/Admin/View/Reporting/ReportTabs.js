import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


//Provides tab navigation UI for switching between different report views in the admin reporting dashboard.
//Recieves active tab name from parent via props
//Converts tab name to numberic index for. MUI tabs
export default function TabManager (props) {
  //Step 1: Converts tabe name to number index
  var idTab = props.activeTab==="Users"? 0 : (props.activeTab==="Teams" ? 1 : (props.activeTab==="AssessmentTasks") ? 2 : 0);
  //Initialize local tab state with calculauted index
  const [value, setValue] = React.useState(idTab);
  //Handle tab change events
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    //Render cented tab bar
    <Tabs value={value} onChange={handleChange} centered>
      <Tab
        label="Assessment Status"

        onClick={() => {
          props.setTab("Assessment Status"); //Notify parent of tab change
        }}

        aria-label='assessmentStatusTab' //Accessibiility label
      />
  {/*Rating and feedback*/}
      <Tab
        label="Ratings and Feedback"

        onClick={() => {
          props.setTab("Ratings and Feedback");
        }}

        aria-label='ratingAndFeedbackTab'
      />
  {/* Improvement future feature for tracking student improvment over time*/}
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