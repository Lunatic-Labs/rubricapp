import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

export default function ViewRatingsHeader(props) {
  console.log("ViewRatingsHeader", props.chosen_assessment_id);
  var assessment_is_team = parseAssessmentIndividualOrTeam(props.assessment_tasks)

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <AssessmentTaskDropdown
            assessment_tasks={props.assessment_tasks}
            chosen_assessment_id={props.chosen_assessment_id}
            set_chosen_assessment_id={props.set_chosen_assessment_id}
          />

          { props.chosen_assessment_id !== '' &&
            <Typography style={{ margin: "20px"}} variant='h5'> {
              assessment_is_team[props.chosen_assessment_id] ? "Team Assignment" : "Individual Assignment"
              }
            </Typography>
          }

        </Box>

        <Box>
          <Typography style={{ margin: "20px"}} variant='h5'>54% of students (54/100) have completed the rubric</Typography>
        </Box>
      </Box>
    </Box>
  );
}