import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AssessmentTaskDropdown(props) {
    var assessment_task_list = []

    props.assessment_tasks.map((assessment_task) => {
        return assessment_task_list.push(
          <MenuItem
            key={
              assessment_task["assessment_task_id"]
            }
            value={
              assessment_task["assessment_task_id"]
            }
          >
            {assessment_task["assessment_task_name"]}
          </MenuItem>
        )
      })

    console.log("ATDropdown", props.chosen_assessment_id);
    return (
        <FormControl sx={{ m: 3, minWidth: 300 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Assessment Task: Rubric</InputLabel>

            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={props.chosen_assessment_id}
              onChange={props.set_chosen_assessment_id}
              autoWidth
              label="Assessment Task: Rubric"
            >
              { assessment_task_list }
            </Select>
        </FormControl>
    )
}