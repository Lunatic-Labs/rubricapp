import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabManagerProps {
    navbar: any;
    activeTab: string;
    setTab: (tab: string) => void;
}

interface ReportTab {
    label: string;
    ariaLabel: string;
    // The activeTab value that selects this tab when the reporting view opens.
    selectedBy: string;
    // Ratings and Feedback is scoped to a single course, which a super admin has
    // no place inside; admins and instructors keep it.
    hideFromSuperAdmin?: boolean;
}

const REPORT_TABS: ReportTab[] = [
    { label: "Assessment Status", ariaLabel: "assessmentStatusTab", selectedBy: "Users" },
    { label: "Ratings and Feedback", ariaLabel: "ratingAndFeedbackTab", selectedBy: "Teams", hideFromSuperAdmin: true },
    { label: "Export Graph Comparison", ariaLabel: "exportGraphComparisonTab", selectedBy: "AssessmentTasks" },
];

export default function TabManager(props: TabManagerProps) {
  // AppState takes isSuperAdmin as a prop, so that is where the flag lives on the
  // navbar it hands down.
  const isSuperAdmin = Boolean(props.navbar?.props?.isSuperAdmin);

  const visibleTabs = REPORT_TABS.filter(tab => !(tab.hideFromSuperAdmin && isSuperAdmin));

  // Derived from the visible tabs rather than a fixed position, so hiding one does
  // not leave the selection pointing at its neighbour or past the end of the list.
  // An activeTab with no tab of its own falls back to the first, which is also what
  // a super admin gets for the tab they cannot see.
  const idTab = Math.max(0, visibleTabs.findIndex(tab => tab.selectedBy === props.activeTab));

  const [value, setValue] = React.useState(idTab);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
        {visibleTabs.map(tab => (
          <Tab
            key={tab.ariaLabel}

            label={tab.label}

            onClick={() => {
              props.setTab(tab.label);
            }}

            aria-label={tab.ariaLabel}
          />
        ))}

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