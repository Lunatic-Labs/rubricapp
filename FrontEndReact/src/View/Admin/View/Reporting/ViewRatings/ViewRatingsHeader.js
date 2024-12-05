import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';



export default function ViewRatingsHeader(props) {
  var assessmentIsTeam = parseAssessmentIndividualOrTeam(props.assessmentTasks);

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <AssessmentTaskDropdown
            assessmentTasks={props.assessmentTasks}
            chosenAssessmentId={props.chosenAssessmentId}
            setChosenAssessmentId={props.setChosenAssessmentId}
          />

          { props.chosenAssessmentId !== '' &&
            <Typography style={{ margin: "20px" }} variant='h5'>
              { assessmentIsTeam[props.chosenAssessmentId] ? "Team Assignment" : "Individual Assignment" }
            </Typography>
          }

          <Box sx={{ display: "flex", justifyContent: "flex-end", flexGrow:"1", gap:"2%"}}>
            <Button
              variant='contained'
            >
              Export Ratings
            </Button>

            <Button
              variant='contained'
            >
              Export Comments
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}