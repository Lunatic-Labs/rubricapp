import React, { Component } from 'react';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';

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
          "rating" : "(0, 1]",
          "number" : 8
        },
        {
          "rating" : "(1, 2]",
          "number" : 14
        },
        {
          "rating" : "(2, 3]",
          "number" : 39
        },
        {
          "rating" : "(3, 4]",
          "number" : 14
        },
        {
          "rating" : "(4, 5]",
          "number" : 8
        },
      ]
    }
    var characteristic_data = {
      characteristics: [
        {
          "characteristic" : "Identified the general types of data or information needed to address the question.",
          "number" : 16,
          "percentage" : "64%"
        },
        {
          "characteristic" : "Identified any situational factors that may be important for addressing the question or situation.",
          "number" : 19,
          "percentage" : "76%"
        },{
          "characteristic" : "Identified the question that needed to be answered or the situation that needed to be addressed.",
          "number" : 12,
          "percentage" : "48%"
        },
      ]
    }
    var improvement_data = {
      improvements: [
        {
          "improvement" : "Write down the information you think is needed to address the situation",
          "number" : 18,
          "percentage" : "72%"
        },
        {
          "improvement" : "List the factors (if any) that may limit the feasability of some possible conclusions",
          "number" : 16,
          "percentage" : "64%"
        },
        {
          "improvement" : "Highlight or clearly state the question to be addressed or type of conclusion that must be reached",
          "number" : 19,
          "percentage" : "76%"
        },
        {
          "improvement" : "Review the instructions or general goal of the task",
          "number" : 12,
          "percentage" : "48%"
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
                alignItems:"center",
            }}
            className='d-flex flex-column'
          >
            <Grid container rowSpacing={0} columnSpacing={0} style={{ width: "90vw",}}>
              {/* Top left: histogram of assessment task ratings */}
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
                        borderRadius: '10px',
                        border: "3px #2e8bef",
                        borderTopStyle : "solid", 
                        margin: "2px 2px 2px 2px",
                        boxShadow: "0 2px 0 #d6d6d6"
                    }}
                >
                  <h5>
                    Distribution of ratings (Avg: 3; StdDev: 0.23)
                  </h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart  data={ratings_data["ratings"]} barCategoryGap={0.5}>
                      <XAxis dataKey="rating"/>
                      <YAxis width={25} domain={[0, 'auto']}/>
                      <CartesianGrid vertical={false}/>
                      <Bar dataKey= "number" fill = "#2e8bef">
                        <LabelList dataKey="number" fill="#ffffff" position="inside"/>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Grid>
              {/* Top right: evaluation status of students and TAs */}
              <Grid
                sx={{
                    display:"flex",
                    justifyContent:"center"
                }}
                direction='column'
                item xs={6}
              >
                {/* Top half of top right: evaluation status of students */}
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
                        borderRadius: '10px',
                        border: "3px #2e8bef",
                        borderTopStyle : "solid", 
                        margin: "2px 2px 2px 2px",
                        boxShadow: "0 2px 0 #d6d6d6"
                    }}
                  > 
                    <h1>54% of students (54/100) have completed the rubric</h1>
                  </div>
                </Grid>
                {/* Bottom half of top right: evaluation status of TAs */}
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
                        borderRadius: '10px',
                        border: "3px #2e8bef",
                        borderTopStyle : "solid", 
                        margin: "2px 2px 2px 2px",
                        boxShadow: "0 2px 0 #d6d6d6"
                    }}
                  >
                    <h1>43% of TA evaluations (43/100) are complete</h1>
                    <Button
                        style={{
                            width:"30%",
                            height:"100%", 
                            backgroundColor: "#2E8BEF",
                            color:"white",
                            position: "center"
                        }}
                    >
                        View Details
                    </Button>
                  </div>
                </Grid>
              </Grid>
              {/* Bottom left: bar graph of characteristics selected */}
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
                        borderRadius: '10px',
                        border: "3px #2e8bef",
                        borderTopStyle : "solid", 
                        margin: "2px 2px 2px 2px",
                        boxShadow: "0 2px 0 #d6d6d6"
                    }}
                >
                  <h5>
                    Improvements Selected
                  </h5>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout='vertical'  data={improvement_data["improvements"]}>
                      <XAxis type='number' domain={[0, 'auto']}/>
                      <YAxis width={250} style={{ fontSize: '12px', width: 'fit-content'}} type='category' dataKey="improvement"/>
                      <CartesianGrid horizontal= {false} />
                      <Bar dataKey= "number" fill = "#2e8bef">
                        <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  
                </div>
              </Grid>
              {/* Bottom right: bar graph of improvements selected */}
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
                      borderRadius: '10px',
                      border: "3px #2e8bef",
                      borderTopStyle : "solid", 
                      margin: "2px 2px 2px 2px",
                      boxShadow: "0 2px 0 #d6d6d6"
                  }}
                >
                  <h5>
                    Characteristics Selected
                  </h5>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart  layout='vertical' data={characteristic_data["characteristics"]}>
                      <XAxis type='number' domain={[0, 'auto']}/>
                      <YAxis width={250} style={{ fontSize: '12px', width: 'fit-content'}} type='category' dataKey="characteristic"/>
                      <CartesianGrid horizontal= {false}/>
                      <Bar dataKey= "number" fill = "#2e8bef">
                        <LabelList dataKey="percentage" fill="#ffffff" position="inside"/>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </>
    )
  }
}