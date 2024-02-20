import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

export default function ViewRatingsHeader(props) {
  var assessmentIsTeam = parseAssessmentIndividualOrTeam(props.assessmentTasks)

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
          <AssessmentTaskDropdown
            assessmentTasks={props.assessmentTasks}
            chosenAssessmentId={props.chosenAssessmentId}
            setChosenAssessmentId={props.setChosenAssessmentId}
          />

          { props.chosenAssessmentId !== '' &&
            <Typography style={{ margin: "20px"}} variant='h5'> {
              assessmentIsTeam[props.chosenAssessmentId] ? "Team Assignment" : "Individual Assignment"
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