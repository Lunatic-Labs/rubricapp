import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import AdminViewReport from './AdminViewReport';

export default function ReportHome(props) {
    var [tab, setTab] = useState('');
    return (
        <>
            <div className='container'>
                <Box
                    sx={{
                        minHeight:"75vh",
                        display:"flex",
                        alignItems:"center"
                    }}
                    className='d-flex flex-column mt-5'
                    >
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
                            xs={3}
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
                                    borderRadius: '10px'
                                }}
                            >        
                            <h2 style={{ margin: "-90px -5px 5px -200px"}}> {props.chosenCourse["course_name"]} {props.chosenCourse["course_number"]}</h2> 
                                <Button
                                    style={{
                                        width:"100%",
                                        backgroundColor: "transparent",
                                        color: "#B0ADAD",
                                        margin: "-90px 5px 5px 0px",
                                        position: "center",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => {
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
                            xs={3}
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
                                    borderRadius: '10px'
                                }}
                            >
                                <Button
                                    style={{
                                        width:"100%",
                                        backgroundColor: "transparent",
                                        color: "#B0ADAD",
                                        margin: "-90px 5px 5px 0px",
                                        position: "center",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => {
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
                            xs={3}
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
                                    borderRadius: '10px'
                                }}
                            >
                                <Button
                                    style={{
                                        width:"100%",
                                        backgroundColor: "transparent",
                                        color: "#B0ADAD",
                                        margin: "-90px 5px 5px 0",
                                        position: "center",
                                        fontWeight: "bold"
                                    }}
                                    onClick={() => {
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
                            xs={3}
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
                                    borderRadius: '10px'
                                }}
                            >
                                <Button
                                    style={{
                                    width:"100%",
                                    backgroundColor: "transparent",
                                    color: "#B0ADAD",
                                    margin: "-90px 5px 5px 0",
                                    position: "center",
                                    fontWeight: "bold",
                                    }}
                                    onClick={() => {
                                        setTab("Calibrations");
                                    }}
                                >
                                  Calibrations
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                    { tab === 'Ratings and Feedback' &&
                        <AdminViewReport
                            chosenCourse={props.chosenCourse}
                        />
                    }
                </Box>
            </div>
        </>
    );
}

/*    style={{
                                        underline: {textDecorationLine: 'underline', color: "#2E8BEF"}
                                    }}
                                   >Calibrations</u> */