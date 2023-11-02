import * as React from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
// import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
// import Paper from '@mui/material/Paper';
import pencil from '../Reporting/ReportTabImages/pencil.png'
import improvementIcon from '../Reporting/ReportTabImages/improvement.png'
import callibrationIcon from '../Reporting/ReportTabImages/callibration.png'
import ratingsIcon from '../Reporting/ReportTabImages/ratings.png'
import { useState } from 'react';
import AdminViewReport from './AdminViewReport';

export default function ReportHome(props) {
    var [tab, setTab] = useState('');
    return (
        <>
            { tab === '' &&
                <Container>
                    <Box
                        sx={{
                            minHeight:"100vh",
                            display:"flex",
                            alignItems:"center"
                        }}
                        className='d-flex flex-column mt-5'
                        >
                        <h1>
                            {props.chosenCourse["course_name"]} {props.chosenCourse["course_number"]}
                        </h1>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{
                                xs: 1,
                                sm: 2,
                                md: 3
                            }}
                        >
                            <Grid
                                sx={{
                                    display:"flex",
                                    justifyContent:"center"
                                }}
                                item
                                xs={6}
                            >
                                <div
                                    className='
                                        d-flex
                                        flex-column
                                        m-3
                                        p-3
                                        w-100
                                        justify-content-center
                                        align-items-center
                                    '
                                    style={{
                                        backgroundColor: "#2E8BEF",
                                        borderRadius: '10px'
                                    }}
                                >
                                    <img
                                        src={pencil}
                                        alt=""
                                        className='w-50'
                                    ></img>
                                    <Button
                                        style={{
                                            color: 'white'
                                        }}
                                        onClick={() => {
                                            // this.setNewTab("AssessmentStatus");
                                            setTab("Assessment Status");
                                        }}
                                    >
                                        Assessment Status
                                    </Button>
                                </div>
                            </Grid>
                            <Grid
                                sx={{
                                    display:"flex",
                                    justifyContent:"center"
                                }}
                                item
                                xs={6}
                            >
                                <div
                                    className='
                                        d-flex
                                        flex-column
                                        m-3
                                        p-3
                                        w-100
                                        justify-content-center
                                        align-items-center
                                    '
                                    style={{
                                        backgroundColor: "#2E8BEF",
                                        borderRadius: '10px'
                                    }}
                                >
                                    <img
                                        src={ratingsIcon}
                                        alt=""
                                        className='w-50'
                                    ></img>
                                    <Button
                                        style={{
                                            width:"100%",
                                            backgroundColor: "#2E8BEF",
                                            color:"white",
                                            margin: "10px 5px 5px 0",
                                            position: "center"
                                        }}
                                        onClick={() => {
                                            // this.setNewTab("Ratings");
                                            setTab("Ratings and Feedback");
                                        }}
                                    >
                                        Ratings and Feedbacks
                                    </Button>
                                </div>
                            </Grid>
                            <Grid
                                sx={{
                                    display:"flex",
                                    justifyContent:"center"
                                }}
                                item
                                xs={6}
                            >
                                <div
                                    className='
                                        d-flex
                                        flex-column
                                        m-3
                                        p-3
                                        w-100
                                        justify-content-center
                                        align-items-center
                                    '
                                    style={{
                                        backgroundColor: "#2E8BEF",
                                        borderRadius: '10px'
                                    }}
                                >
                                    <img
                                        src={improvementIcon}
                                        alt=""
                                        className='w-50'
                                    ></img>
                                    <Button
                                        style={{
                                            width:"100%",
                                            backgroundColor: "#2E8BEF",
                                            color:"white",
                                            margin: "10px 5px 5px 0",
                                            position: "center"
                                        }}
                                        onClick={() => {
                                            // this.setNewTab("Improvement");
                                            setTab("Improvement");
                                        }}
                                    >
                                        Improvement
                                    </Button>
                                </div>
                            </Grid>
                            <Grid
                                sx={{
                                    display:"flex",
                                    justifyContent:"center"
                                }}
                                item
                                xs={6}
                            >
                                <div
                                    className='
                                        d-flex
                                        flex-column
                                        m-3
                                        p-3
                                        w-100
                                        justify-content-center
                                        align-items-center
                                    '
                                    style={{
                                        backgroundColor: "#2E8BEF",
                                        borderRadius: '10px'
                                    }}
                                >
                                    <img
                                        src={callibrationIcon}
                                        alt=""
                                        className='w-50'
                                    ></img>
                                    <Button
                                        style={{
                                            width:"100%",
                                            backgroundColor: "#2E8BEF",
                                            color:"white",
                                            margin: "10px 5px 5px 0",
                                            position: "center",
                                        }}
                                        onClick={() => {
                                            // this.setNewTab("Callibration");
                                            setTab("Calibrations");
                                        }}
                                    >
                                        Calibrations
                                    </Button>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </Container>
            }
            { tab === 'Ratings and Feedback' &&
                <AdminViewReport
                    chosenCourse={props.chosenCourse}
                />
            }
        </>
    );
}
