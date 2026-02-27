import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

// For further documentation look inside the README

/**
 * Creates a function, BasicTabs.
 * 
 * @function BasicTabs
 * @param {Object} props - Component properties.
 * @param {Object} props.navbar - A reference to the AppState component, used for accessing global state and navigation callbacks.
 * 
 * Internally derived values:
 * @property {Object} navbar.state - The global application state.
 * @property {string} navbar.state.activeTab - The currently active application tab.
 * @property {function} navbar.setNewTab - Callback used to update the active tab.
 * @property {boolean} useFixedTeams - Determines whether the "Teams" tab is shown, based on the selected course's `use_fixed_teams` configuration.
 */

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

  /**
   * @method handleChange - Handles internal tab selection changes for the MUI Tabs component.
   * @param {React.SyntheticEvent} event - The event triggered when the user interacts with the tabs.
   * @param {number} newValue - The index of the newly selected tab within the MUI Tabs component.
   */

  const handleChange = (event: any, newValue: any) => {
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