import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function AssessmentTaskDropdown(props) {
  var assessmentTaskList = [];

  props.assessmentTasks.map((assessmentTask) => {
    // new code here

    // This new code shortens the name of assessment task when it is displayed on the page
    // this prevents the text from 'overflowing' and causing miss-alignment with other elements on the page.
    // However this is a fixed size and thus cannot be altered, should a solution be made to automatically truncate the text?
    // It also seems to affect the name in the drop-down menu, that might require fixing...
    const truncatedName = assessmentTask["assessment_task_name"].length > 30 
    ? assessmentTask["assessment_task_name"].substring(0, 30) + "..."
    : assessmentTask["assessment_task_name"];

    // {assessmentTask["assessment_task_name"]} was in place of {truncatedName}

    return assessmentTaskList.push(
      <MenuItem key={assessmentTask["assessment_task_id"]} value={assessmentTask["assessment_task_id"]}>
        {truncatedName}
      </MenuItem>
    );
  });

  return (
    <FormControl sx={{ m: 3, minWidth: 300 }}>
      <InputLabel id="demo-simple-select-autowidth-label">Assessment Task</InputLabel>

      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={props.chosenAssessmentId}
        onChange={props.setChosenAssessmentId}
        autoWidth
        label="Assessment Task"
      >
        { assessmentTaskList }
      </Select>
    </FormControl>
  )
}