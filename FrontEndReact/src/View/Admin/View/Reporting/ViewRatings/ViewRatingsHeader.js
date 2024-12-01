import * as React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import { genericResourceGET, parseAssessmentIndividualOrTeam } from '../../../../../utility';



export default function ViewRatingsHeader(props) {
  var assessmentIsTeam = parseAssessmentIndividualOrTeam(props.assessmentTasks);

  const handleRatingsExport = () => {
    let promise = genericResourceGET(
      //fix the route name
      `/SpecifiyROute?assessment_task_id=${props.chosenAssessmentId}`,
      this,
    )

    promise.then(result => {
      if (result !== undefined && result.errorMessage === null) {
        //These next three vars need to be fixed look at the other export button.
        var assessmentName = 'ToBeFiguredout';
    
        var newExportButtonJSON = 'Export Ratings';
    
        newExportButtonJSON[assessmentName] = 'Export Ratings';
    
        this.setState({
          downloadedAssessment: assessmentName,
          exportButtonId: newExportButtonJSON
        });                }
    });
    }

  return (
    <Box>
      <Box style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
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

          <Box sx={{display:"flex"}}>
            <Button
                className='primary-color'
                variant='contained' 
                aria-label='Export Ratings'
                onClick={handleRatingsExport}
            >
                Export Ratings
            </Button>
          </Box>
          <Box sx={{display:"flex", gap:'20px'}}>
            <Button
                className='primary-color'
                variant='contained' 
                aria-label='Export Ratings'
                onClick={handleRatingsExport}
            >
                Export Comments
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}