// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import * as React from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, Typography } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';



export default function ViewRatingsHeader(props: any) {
  var assessmentIsTeam = parseAssessmentIndividualOrTeam(props.assessmentTasks);
  return (
    // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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
              // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
              { assessmentIsTeam[props.chosenAssessmentId] ? "Team Assignment" : "Individual Assignment" }
            </Typography>
          }

        </Box>
      </Box>
    </Box>
  );
}