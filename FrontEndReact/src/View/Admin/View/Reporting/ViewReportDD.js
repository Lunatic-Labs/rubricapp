import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function ViewReportDD() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <div>
      <FormControl sx={{ m: 3, minWidth: 300 }}>
        <InputLabel id="demo-simple-select-autowidth-label">Assessment Task: Rubric</InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="AssessmentTask: Rubric"
        >
          <MenuItem value={10}>Assessment Task #1: Critical Thinking</MenuItem>
          <MenuItem value={21}>Assessment Task #2: Critical Thinking</MenuItem>
          <MenuItem value={22}>Assessment Task #3: Critical Thinking</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}