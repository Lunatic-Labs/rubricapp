import React, { Component } from 'react';
import {BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer } from 'recharts';

import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReports extends Component {
  render() {
    var courses = this.props.courses;
    console.log(courses); 

    var ratings_data = {
      ratings: [
        {
          "rating" : 1,
          "number" : 8
        },
        {
          "rating" : 2,
          "number" : 14
        },
        {
          "rating" : 3,
          "number" : 35
        },
        {
          "rating" : 4,
          "number" : 14
        },
        {
          "rating" : 5,
          "number" : 8
        },
      ]
    }
    var characteristic_data = {
      characteristics: [
        {
          "characteristic" : "Identified the general types of data or information needed to address the question.",
          "number" : 16
        },
        {
          "characteristic" : "Identified any situational factors that may be important for addressing the question or situation.",
          "number" : 19
        },{
          "characteristic" : "Identified the question that needed to be answered or the situation that needed to be addressed.",
          "number" : 12
        },
      ]
    }
    var improvement_data = {
      improvements: [
        {
          "improvement" : "Write down the information you think is needed to address the situation",
          "number" : 18
        },
        {
          "improvement" : "List the factors (if any) that may limit the feasability of some possible conclusions",
          "number" : 16
        },
        {
          "improvement" : "Highlight or clearly state the question to be addressed or type of conclusion that must be reached",
          "number" : 19
        },
        {
          "improvement" : "Review the instructions or general goal of the task",
          "number" : 12
        },

      ]
    }

return (
      <>
        <Container>
            <Box
              sx={{
                  // minHeight:"100vh",
                  display:"flex",
                  alignItems:"center"
              }}
              className='d-flex flex-column'
              // className='d-flex flex-column mt-5'
            >
            <h1>
                Goofy Flap
            </h1>
                <Grid
                    container
                    rowSpacing={0}
                    columnSpacing={0}
                    style={{ 
                      width: "90vw",
                    }}
                >
                    <Grid
                        sx={{
                            display:"flex",
                            justifyContent:"center",
                            margin:"0px 0px 0px 0px",
                        }}
                        item xs={6}
                    >
                        <div
                            className='
                                d-flex
                                flex-column
                                p-3
                                w-100
                                justify-content-center
                                align-items-center
                            '
                            style={{
                                // backgroundColor: "#2E8BEF",
                                // borderRadius: '10px'
                                border: "1px solid black",
                                margin: "2px 2px 2px 2px"
                            }}
                        >
                            {/* <Button
                                style={{
                                    color: 'white',
                                    position: 'center'
                                }}
                            >
                                Henry
                            </Button> */}
                            {/* <p>Henry</p> */}
                            {/* <ResponsiveContainer> */}
                              <BarChart width={550} height={250}  data={ratings_data["ratings"]} barCategoryGap={0.5}>
                                <XAxis dataKey="rating"/>
                                <YAxis />
                                <Bar dataKey= "number" fill = "#2e8bef"/>
                                <CartesianGrid vertical={false}/>
                              </BarChart>
                            {/* </ResponsiveContainer> */}
                            
                        </div>
                    </Grid>
                    <Grid
                        sx={{
                            display:"flex",
                            justifyContent:"center"
                        }}
                        item xs={6}
                    >
                        <div
                            className='
                                d-flex
                                flex-column
                                p-3
                                w-100
                                justify-content-center
                                align-items-center
                            '
                            style={{
                                // backgroundColor: "#2E8BEF",
                                // borderRadius: '10px'
                                border: "1px solid black",
                                margin: "2px 2px 2px 2px"
                            }}
                        >
                            {/* <Button
                                style={{
                                    width:"100%",
                                    height:"100%", 
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    // margin: "10px 5px 5px 0",
                                    position: "center"
                                }}
                            >
                                Emma
                            </Button> */}
                            <p>Placeholder</p>
                        </div>
                    </Grid>
                    <Grid
                        sx={{
                            display:"flex",
                            justifyContent:"center"
                        }}
                        item xs={6}
                    >
                        <div
                            className='
                                d-flex
                                flex-column
                                p-3
                                w-100
                                justify-content-center
                                align-items-center
                            '
                            style={{
                                // backgroundColor: "#2E8BEF",
                                // borderRadius: '10px'
                                border: "1px solid black",
                                margin: "2px 2px 2px 2px"
                            }}
                        >
                            {/* <Button
                                style={{
                                    width:"100%",
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    // margin: "10px 5px 5px 0",
                                    position: "center"
                                }}
                            >
                                Chester
                            </Button> */}
                            <BarChart width={525} height={250} layout='vertical'  data={improvement_data["improvements"]}>
                              <XAxis type='number' domain={[0, 'auto']}/>
                              <YAxis width={250} type='category' dataKey="improvement" fontSize={12}/>
                              <Bar dataKey="number" fill="#2e8bef"/>
                              <CartesianGrid horizontal= {false} />
                            </BarChart>
                        </div>
                    </Grid>
                    <Grid
                        sx={{
                            display:"flex",
                            justifyContent:"center"
                        }}
                        item xs={6}
                    >
                        <div
                            className='
                                d-flex
                                flex-column
                                p-3
                                w-100
                                justify-content-center
                                align-items-center
                            '
                            style={{
                                // backgroundColor: "#2E8BEF",
                                // borderRadius: '10px'
                                border: "1px solid black",
                                margin: "2px 2px 2px 2px" 
                            }}
                        >
                            {/* <Button
                                style={{
                                    width:"100%",
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    // margin: "10px 5px 5px 0",
                                    position: "center",
                                }}
                            >
                                Charlie
                            </Button> */}
                            <BarChart width={525} height={250} layout='vertical'  data={characteristic_data["characteristics"]}>
                              <XAxis type='number' domain={[0, 'auto']}/>
                              <YAxis width={150} type='category' dataKey="characteristic" fontSize={12}/>
                              <Bar dataKey="number" fill="#2e8bef"/>
                              <CartesianGrid horizontal= {false}/>
                            </BarChart>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </Container>


        {/* Bar chart where bars are vertical */}
        <h1>There are currently {courses.length} courses in the POGIL DB</h1>
        <BarChart width={400} height={250} data={ratings_data["ratings"]} barCategoryGap={0.5}>
            <XAxis dataKey="rating"/>
            <YAxis />
            <Bar dataKey= "number" fill = "#2e8bef"/>
        </BarChart>

        {/* Bar chart where bars are horizontal */}
        <BarChart width={800} height={250} layout='vertical'  data={improvement_data["improvements"]}>
            <XAxis type='number' domain={[0, 'auto']}/>
            <YAxis width={350} type='category' dataKey="improvement"/>
            <Bar dataKey="number" fill="#2e8bef"/>
            <CartesianGrid horizontal= {false} />
        </BarChart>

        <BarChart width={800} height={200} layout='vertical'  data={characteristic_data["characteristics"]}>
            <XAxis type='number' domain={[0, 'auto']}/>
            <YAxis width={350} type='category' dataKey="characteristic"/>
            <Bar dataKey="number" fill="#2e8bef"/>
            <CartesianGrid horizontal= {false}/>
        </BarChart>
      </>
    )
  }
}