// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import * as React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/InputLabel' or i... Remove this comment to see the full error message
import InputLabel from '@mui/material/InputLabel';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/MenuItem' or its... Remove this comment to see the full error message
import MenuItem from '@mui/material/MenuItem';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/FormControl' or ... Remove this comment to see the full error message
import FormControl from '@mui/material/FormControl';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Select' or its c... Remove this comment to see the full error message
import Select from '@mui/material/Select';


export default function AssessmentTaskDropdown(props: any) {
  var assessmentTaskList = [];

  // Check if assessmentTasks exists and is not empty to prevent null reference errors
  if (props.assessmentTasks && props.assessmentTasks.length > 0) {
    props.assessmentTasks.map((assessmentTask: any) => {

    const taskName = assessmentTask["assessment_task_name"];

    return assessmentTaskList.push(
      <MenuItem
          key = {assessmentTask["assessment_task_id"]}
          value = {assessmentTask["assessment_task_id"]}
          sx={{
          // sx -> system extensions (writes css directly as Java Script).
          // The code here handles the 'text overflow' when re-sizing the page and/or creating a very long
          // assessment task name.
          //
          // The 'nowrap' prevents the text from wrapping around (more than 1 line of text)
          // The 'ellipsis' ends the truncated text with ...
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}
      >
        {taskName}
      </MenuItem>
    );
  });
  } else {
    // Display placeholder when no assessment tasks are available
    assessmentTaskList.push(
      // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
      <MenuItem key="no-tasks" value="" disabled>
        No assessment tasks available
      </MenuItem>
    );
  } 

  return (
    <FormControl 
    // controls the way the 'dropdown' is displayed.
      sx={{ 
        m: 3,           // margin
        width: (!props.assessmentTasks || props.assessmentTasks.length === 0) ? '100%' : '95%',    // wider width when showing "no tasks" message
        minWidth: '275px'  // ensure minimum width to display the full message
      }}
    >
      <InputLabel id="demo-simple-select-autowidth-label">
        {(!props.assessmentTasks || props.assessmentTasks.length === 0) 
          ? "No assessment tasks available" 
          : "Assessment Task"}
      </InputLabel>

      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={props.chosenAssessmentId || ""}
        onChange={props.setChosenAssessmentId}
        disabled={!props.assessmentTasks || props.assessmentTasks.length === 0}
        autoWidth={"false"}
        label={(!props.assessmentTasks || props.assessmentTasks.length === 0) 
          ? "No assessment tasks available" 
          : "Assessment Task"}
        sx={{
          // This handles the text overflow
          '& .MuiSelect-select': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }}
      >
        { assessmentTaskList }
      </Select>
    </FormControl>
  )
}