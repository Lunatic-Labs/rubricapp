import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function AssessmentTaskDropdown(props) {
  var assessmentTaskList = [];

  props.assessmentTasks.map((assessmentTask) => {
    return assessmentTaskList.push(
      <MenuItem key={assessmentTask["assessment_task_id"]} value={assessmentTask["assessment_task_id"]}>
        {assessmentTask["assessment_task_name"]}
        title={assessmentTask["assessment_task_name"]}
        sx={{
          maxWidth: '250px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      </MenuItem>
    );
  });

  return (
    <FormControl sx={{ m: 3, minWidth: 300, maxWidth: 300 }}>
      <InputLabel id="demo-simple-select-autowidth-label">Assessment Task</InputLabel>

      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={props.chosenAssessmentId}
        onChange={props.setChosenAssessmentId}
        autoWidth={false}
        label="Assessment Task"
        sx={{
          '& .MuiSelect-select': {
            maxWidth: '250px',
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