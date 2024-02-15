import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import AdminViewRatingsDD from './AdminViewRatingsDD';
import { Box, Typography } from '@mui/material';



export default function ViewRatingsDD({ assessmentTasks, assessmentIsTeam }) {
  const handleChange = (event) => {
    setReportMenu(event.target.value);
  };

  var assessmentTaskOptions = [];

  assessmentTasks.map((assessmentTask) => {
    return assessmentTaskOptions.push(
      <MenuItem
        key={
          assessmentTask["assessment_task_id"]
        }

        value={
          assessmentTask["assessment_task_id"]
        }
      >
        {assessmentTask["assessment_task_name"]}
      </MenuItem>
    )
  })

  const [reportMenu, setReportMenu] = React.useState(assessmentTaskOptions[0]['props']['value']);

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
              { assessmentTaskOptions }
            </Select>
          </FormControl>

          { reportMenu!=='' &&
            <Typography style={{ margin: "20px"}} variant='h5'>{assessmentIsTeam[reportMenu] ? "Team Assignment" : "Individual Assignment"}</Typography>
          }

        </Box>

        <Box>
          <Typography style={{ margin: "20px"}} variant='h5'>54% of students (54/100) have completed the rubric</Typography>
        </Box>
      </Box>
      
      { reportMenu!=='' &&
        <AdminViewRatingsDD
          chosenAssessmentTaskId={reportMenu}
        />
      }
    </Box>
  );
}