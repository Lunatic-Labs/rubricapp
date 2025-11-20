// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Tabs' or its cor... Remove this comment to see the full error message
import Tabs from '@mui/material/Tabs';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Tab' or its corr... Remove this comment to see the full error message
import Tab from '@mui/material/Tab';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Box' or its corr... Remove this comment to see the full error message
import Box from '@mui/material/Box';

export default function BasicTabs (props: any){
  var navbar = props.navbar;
  var state = navbar.state;
  var activeTab = state.activeTab;
  var setNewTab = navbar.setNewTab;
  var useFixedTeams = state.chosenCourse?.use_fixed_teams === "Yes" || state.chosenCourse?.use_fixed_teams === true;


  var idTab = activeTab === "Users" ? 0 : 
            (activeTab === "Teams" && useFixedTeams ? 1 : 
            (activeTab === "AssessmentTasks" ? (useFixedTeams ? 2 : 1) : 
            (activeTab === "Reporting" ? (useFixedTeams ? 3 : 2) : 0)));

  const [value, setValue] = React.useState(idTab);

  React.useEffect(() => {
    setValue(idTab);
  }, [activeTab, useFixedTeams, idTab]);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
    <Box>
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab
            onClick={() => {
              setNewTab("Users");
            }}

            label="Roster"
            aria-label="rosterTab"
          />

        {useFixedTeams && 
          <Tab
            onClick={() => {
              setNewTab("Teams");
            }}

            label="Teams"
            aria-label="teamsTab"
          />
        }  

          <Tab
            onClick={() => {
              setNewTab("AssessmentTasks");
            }}

            label="Assessment Task"
            aria-label="assessmentTab"
          />

          <Tab
            onClick={() => {
              setNewTab("Reporting");
            }}

            label="Reporting"
            aria-label="reportingTab"
          />
        </Tabs>
      </Box>
    </Box>
  );
}