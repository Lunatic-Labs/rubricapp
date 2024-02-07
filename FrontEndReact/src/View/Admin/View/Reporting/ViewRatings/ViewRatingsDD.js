import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdminViewRatingsDD from './AdminViewRatingsDD';
import { Box, Typography } from '@mui/material';



export default function ViewRatingsDD({ assessment_tasks, assessment_is_team }) {
  const handleChange = (event) => {
    setReportMenu(event.target.value);
  };

  var assessment_task_options = [];

  assessment_tasks.map((assessment_task) => {
    return assessment_task_options.push(
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

  const [reportMenu, setReportMenu] = React.useState(assessment_task_options[0]['props']['value']);

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
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
            <Typography style={{ margin: "20px"}} variant='h5'>{assessment_is_team[reportMenu] ? "Team Assignment" : "Individual Assignment"}</Typography>
          }

        </Box>

        <Box>
          <Typography style={{ margin: "20px"}} variant='h5'>54% of students (54/100) have completed the rubric</Typography>
        </Box>
      </Box>
      
      { reportMenu!=='' &&
        <AdminViewRatingsDD
          chosen_assessment_task_id={reportMenu}
        />
      }
    </Box>
  );
}