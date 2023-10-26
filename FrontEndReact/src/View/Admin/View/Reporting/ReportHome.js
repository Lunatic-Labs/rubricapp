import * as React from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import pencil from '../Reporting/ReportTabImages/pencil.png'
import improvementIcon from '../Reporting/ReportTabImages/improvement.png'
import callibrationIcon from '../Reporting/ReportTabImages/callibration.png'

export default function ReportHome() {
  return (
    <Container>
        <Box sx={{minHeight:"100vh", display:"flex", alignItems:"center"}}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid sx={{display:"flex", justifyContent:"center"}} item xs={6}>
            <Button
                    style={{
                        width:"100%",
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
            <Grid sx={{display:"flex", justifyContent:"center"}} item xs={6}>
            <Button
                    style={{
                        width:"100%",
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
            <Grid sx={{display:"flex", justifyContent:"center"}} item xs={6}>
            <Button
                    style={{
                        width:"100%",
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
            <Grid sx={{display:"flex", justifyContent:"center"}}item xs={6}>
            <Button
                style={{
                    width:"100%",
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
    </Container>
  );
}


