import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import pencil from '../Admin/View/Reporting/ReportTabImages/pencil.png'
import improvementIcon from '../Admin/View/Reporting/ReportTabImages/improvement.png'
import callibrationIcon from '../Admin/View/Reporting/ReportTabImages/callibration.png'

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
            <Button
                style={{
                    backgroundColor: "#2E8BEF",
                    color:"white",
                    margin: "10px 5px 5px 0",
                    position: "center"
                }}
                >
                Assessment Status
                <img
                    src={pencil}
                    alt=""
                ></img>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button
                style={{
                    backgroundColor: "#2E8BEF",
                    color:"white",
                    margin: "10px 5px 5px 0",
                    position: "center"
                }}
                >
                Ratings and Feedbacks
                <img
                    src={pencil}
                    alt=""
                ></img>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button
                style={{
                    backgroundColor: "#2E8BEF",
                    color:"white",
                    margin: "10px 5px 5px 0",
                    position: "center"
                }}
                >
                Improvement
                <img
                    src={improvementIcon}
                    alt=""
                ></img>
            </Button>
        </Grid>
        <Grid item xs={6}>
            <Button
            style={{
                backgroundColor: "#2E8BEF",
                color:"white",
                margin: "10px 5px 5px 0",
                position: "center",
            }}
            >
            Calibrations
            <img
                src={callibrationIcon}
                alt=""
            ></img>
            </Button>
        </Grid>
      </Grid>
    </Box>
  );
}


