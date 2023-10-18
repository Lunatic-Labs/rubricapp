import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdminViewReportDD from './AdminViewReportDD';

export default function ViewReportDD({ assessment_tasks }) {
  const [reportMenu, setReportMenu] = React.useState('');

  const handleChange = (event) => {
    setReportMenu(event.target.value);
  };

  var assessment_task_options = [];
  assessment_tasks.map((assessment_task) => {
    return assessment_task_options.push(<MenuItem key={assessment_task["assessment_task_id"]} value={assessment_task["assessment_task_id"]}>{assessment_task["assessment_task_name"]}</MenuItem>)
  })

  return (
    <div>
      <FormControl sx={{ m: 3, minWidth: 300 }}>
      <InputLabel id="demo-simple-select-autowidth-label">Assessment Task: Rubric</InputLabel>
        <Select 
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={reportMenu}
          onChange={handleChange}
          autoWidth
          label="Assessment Task: Rubric"
        >
          { assessment_task_options }
        </Select>
      </FormControl>
      { reportMenu!=='' &&
        <AdminViewReportDD
          chosen_assessment_task_id={reportMenu}
        />
      }
    </div>
  );
}