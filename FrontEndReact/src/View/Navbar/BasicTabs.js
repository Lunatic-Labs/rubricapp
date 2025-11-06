import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

export default function BasicTabs (props){
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="tab-colors">
      <Box sx={{ borderColor: 'divider' }}>
        <Tabs 
          value={value} 
          onChange={handleChange} 
          aria-label="basic tabs example"
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