import React, { Component } from 'react';
import {BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';

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
                maxHeight:"100vh",
                display:"flex",
                alignItems:"center"
            }}
            className='d-flex flex-column'
          >
          <h1>
              Operating Systems (CS3523)
          </h1>
            <Grid container rowSpacing={0} columnSpacing={0} style={{ width: "90vw",}}>
              {/* Histogram of assessment task ratings */}
              <Grid
                sx={{
                    display:"flex",
                    justifyContent:"center",
                    margin:"0px 0px 0px 0px",
                }}
                item xs={6}
              >
                <div
                    className='d-flex flex-column p-3 w-100 justify-content-center align-items-center'
                    style={{
                        // borderRadius: '10px'
                        border: "1px solid black",
                        margin: "2px 2px 2px 2px"
                    }}
                >
                  <BarChart width={550} height={250}  data={ratings_data["ratings"]} barCategoryGap={0.5}>
                    <XAxis dataKey="rating"/>
                    <YAxis />
                    <Bar dataKey= "number" fill = "#2e8bef">
                      <LabelList dataKey="number" fill="#ffffff" position="inside"/>
                    </Bar>
                    <CartesianGrid vertical={false}/>
                  </BarChart>
                </div>
              </Grid>
              {/* Evaluation status of students and TAs */}
              <Grid
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}
                direction='column'
                item xs={3}
              >
                <div
                    className='d-flex flex-column p-3 w-100 justify-content-center align-items-center'
                    style={{
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
                direction='column'
                item xs={3}
              >
                <div
                    className='d-flex flex-column p-3 w-100 justify-content-center align-items-center'
                    style={{
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
              {/* Bar graph of characteristics selected */}
              <Grid
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}
                item xs={6}
              >
                <div
                    className='d-flex flex-column p-3 w-100 justify-content-center align-items-center'
                    style={{
                        // borderRadius: '10px'
                        border: "1px solid black",
                        margin: "2px 2px 2px 2px"
                    }}
                >
                  <BarChart width={525} height={250} layout='vertical'  data={improvement_data["improvements"]}>
                    <XAxis type='number' domain={[0, 'auto']}/>
                    <YAxis width={250} type='category' dataKey="improvement" fontSize={12}/>
                    <Bar dataKey="number" fill="#2e8bef"/>
                    <CartesianGrid horizontal= {false} />
                  </BarChart>
                </div>
              </Grid>
              {/* Bar graph of improvements selected */}
              <Grid
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}
                item xs={6}
              >
                <div
                    className='d-flex flex-column p-3 w-100 justify-content-center align-items-center'
                    style={{
                        // borderRadius: '10px'
                        border: "1px solid black",
                        margin: "2px 2px 2px 2px" 
                    }}
                >
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
      </>
    )
  }
}