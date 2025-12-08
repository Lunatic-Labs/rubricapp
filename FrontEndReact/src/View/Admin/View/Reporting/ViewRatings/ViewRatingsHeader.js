import * as React from 'react';
import { Box, Typography } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

//Display the header section for the ratings view, including a dropdown to select which assessment
//task to view and a label showing whether it's a team or indivdual assignment.
//Uses utility function to determine if slected assessment is team-based, renders a cented flex layout containing
//- Assignment task dropdown selector 
export default function ViewRatingsHeader(props) {
  //Step 1: Determine assessment typrs for all assessment
  //Returns object like: {1:false, 2:true, 3:false}
  var assessmentIsTeam = parseAssessmentIndividualOrTeam(props.assessmentTasks);
  return (
    <Box> {/* Outer container - centers everything */}
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%" }}>
          {/*Step 2: Render assessment selection dropdown*/}
          {/*This component allows user to choose which assessment to view*/}

          <AssessmentTaskDropdown
            assessmentTasks={props.assessmentTasks}
            chosenAssessmentId={props.chosenAssessmentId}
            setChosenAssessmentId={props.setChosenAssessmentId}
          />
          {/*Step 3: Conditionally render assignment type label*/}
          {/*Only shows when an assessment is actually selected*/}
          { props.chosenAssessmentId !== '' &&
            <Typography style={{ margin: "20px" }} variant='h5'>
              {/*Look up whether this assessment is team-based and display appropriate label */}
              { assessmentIsTeam[props.chosenAssessmentId] ? "Team Assignment" : "Individual Assignment" }
            </Typography>
          }

        </Box>
      </Box>
    </Box>
  );
}