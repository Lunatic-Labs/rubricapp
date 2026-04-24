import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';
import { AssessmentTask } from '../../../../../types/AssessmentTask';

interface ViewRatingsHeaderProps {
    navbar: any;
    assessmentTasks: AssessmentTask[];
    chosenAssessmentId: string | number;
    setChosenAssessmentId: (id: string | number) => void;
    csvCreation: { csv_data: string } | null;
    userData: unknown;
}

export default function ViewRatingsHeader(props: ViewRatingsHeaderProps) {
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

        </Box>
      </Box>
    </Box>
  );
}