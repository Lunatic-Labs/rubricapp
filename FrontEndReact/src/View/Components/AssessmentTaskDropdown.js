
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function AssessmentTaskDropdown(props) {
  var assessmentTaskList = [];

  props.assessmentTasks.map((assessmentTask) => {

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

  return (
    <FormControl 
    // controlls the way the 'dropdown' is displayed.
      sx={{ 
        m: 3,           // margin
        width: '95%'    // width
      }}
    >
      <InputLabel id="demo-simple-select-autowidth-label">Assessment Task</InputLabel>

      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={props.chosenAssessmentId}
        onChange={props.setChosenAssessmentId}
        autoWidth={"false"}
        label="Assessment Task"
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