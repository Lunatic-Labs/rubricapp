import React, { Component, useState } from 'react';
import MUIDataTable from 'mui-datatables';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ViewTAEval from "./ViewTAEval.js";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown.js';
import CategoryDropdown from '../../../../Components/CategoryDropdown.js';


export default function ViewAssessmentStatus(props) {
    var [chosenCategoryId, setChosenCategoryId] = useState(1);
    const handleChosenCategoryIdChange = (event) => {
      setChosenCategoryId(event.target.value);
    };

    // When the user changes the assessment task, the chosenCategoryId may not correspond to any selectable
    // category in the new rubric, causing the default value in the CategoryDropdown to be blank (ugly). 
    // This piece of code ensures that the chosenCategoryId always falls within the ranges of the 
    // chosenCategoryIds of the selected rubric, so that the CategoryDropdown is always populated with some value. 
    // BUT, it assumes that the category_id's for all rubrics are contiguous. 
    if (chosenCategoryId < props.categories[0]['category_id'] || 
        chosenCategoryId > props.categories[props.categories.length - 1]['category_id']) {
          setChosenCategoryId(props.categories[0]['category_id']);
    }

    console.log("CA", props.completedAssessments);

    var ratingsData = {
      'ratings': [
        {'rating': 0, 'number': 0},
        {'rating': 1, 'number': 0},
        {'rating': 2, 'number': 0},
        {'rating': 3, 'number': 0},
        {'rating': 4, 'number': 0},
        {'rating': 5, 'number': 0},
      ]
    };
    var avg = 0;
    var stdev = 0;

    if (props.completedAssessments.length > 0) {
      var aggRatings = new Array(6).fill(0);
      var allRatings = [];

      for (var i = 0; i < props.completedAssessments.length; i++) {

        // Only collect data from completed assessment tasks
        if (!props.completedAssessments[i]['done']) 
          continue; 

        // Otherwise, iterate through each category and collect the data
        for (var category in props.completedAssessments[i]['rating_observable_characteristics_suggestions_data']) {
          
          // Skip categories that don't pertain to assessment tasks
          if (category === 'comments' || category === 'done')
            continue; 

          var oneRating = props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][category]['rating']
          
          allRatings.push(oneRating);
          aggRatings[oneRating] += 1; 
        }
      }

      // Create the json object that will store the data to display
      ratingsData['ratings'] = [];

      for (i = 0; i < 6; i++) {
        var obj = {};
        obj['rating'] = i;
        obj['number'] = aggRatings[i]; 
        ratingsData['ratings'].push(obj);
      }

      // calc avg/stdev using allRatings
      avg = (allRatings.reduce((a, b) => a + b) / allRatings.length).toFixed(2);
      stdev = (Math.sqrt(allRatings.map(x => (x - avg) ** 2).reduce((a, b) => a + b) / allRatings.length)).toFixed(2);

    } else {
      // // default state if there are no completed assessments that meet the criteria
      // ratingsData['ratings'] = [];

      // for (i = 0; i < 6; i++) {
      //   obj = {};
      //   obj['rating'] = i;
      //   obj['number'] = 0; 
      //   ratingsData['ratings'].push(obj);
      // }

      // avg = 0;
      // stdev = 0;
    }
  
    var characteristicData = {
      characteristics: [
        {
          "characteristic": "Identified the general types of data or information needed to address the question.",
          "number": 16,
          "percentage": "64%"
        },
        {
          "characteristic": "Identified any situational factors that may be important for addressing the question or situation.",
          "number": 19,
          "percentage": "76%"
        },{
          "characteristic": "Identified the question that needed to be answered or the situation that needed to be addressed.",
          "number": 12,
          "percentage": "48%"
        },
      ]
    }

    var improvementData = {
      improvements: [
        {
          "improvement": "Write down the information you think is needed to address the situation",
          "number": 18,
          "percentage": "72%"
        },
        {
          "improvement": "List the factors (if any) that may limit the feasability of some possible conclusions",
          "number": 16,
          "percentage": "64%"
        },
        {
          "improvement": "Highlight or clearly state the question to be addressed or type of conclusion that must be reached",
          "number": 19,
          "percentage": "76%"
        },
        {
          "improvement": "Review the instructions or general goal of the task",
          "number": 12,
          "percentage": "48%"
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
              {/* Top left quadrant: histogram of assessment task ratings */}
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
                  <h6>
                    Distribution of Ratings
                  </h6>
                  <h6>
                    Avg: {avg}; StdDev: {stdev}
                  </h6>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart  data={ratingsData["ratings"]} barCategoryGap={0.5}>
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
              {/* Top right quadrant: dropdowns + evaluation status of students and TAs */}
              <Grid
                sx={{
                    display:"flex",
                    flexDirection: "column",
                    justifyContent:"center"
                }}
                item xs={6}
              >
                {/* Top half of quadrant: 2 dropdowns */}
                <Grid
                sx={{
                  display:"flex",
                  flexDirection: "row",
                  justifyContent:"center"
                }}

                item xs={12}
              >
                {/* Dropdown #1 */}
                <Grid
                  sx={{
                    display:"flex",
                    justifyContent:"center"
                  }}

                  item xs={12}
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
                      <AssessmentTaskDropdown
                        assessmentTasks={props.assessmentTasks}
                        chosenAssessmentId={props.chosenAssessmentId}
                        setChosenAssessmentId={props.setChosenAssessmentId}
                      />
                    </div>
                  </Grid>
                  {/* Dropdown #2 */}
                  <Grid
                  sx={{
                    display:"flex",
                    justifyContent:"center"
                  }}

                  item xs={12}
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
                    <CategoryDropdown
                      categories={props.categories}
                      chosenCategoryId={chosenCategoryId}
                      setChosenCategoryId={handleChosenCategoryIdChange}
                      disabled={props.completedAssessments.length == 0}
                    />
                  </div>
                </Grid>
              </Grid>

              {/* Bottom half of quadrant: evaluation status of students and TAs */}
              <Grid
                sx={{
                  display:"flex",
                  flexDirection: "row",
                  justifyContent:"center"
                }}

                item xs={12}
              >
                {/* Evaluation status of students */}
                <Grid
                  sx={{
                    display:"flex",
                    justifyContent:"center"
                  }}

                  item xs={12}
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

                {/* Evaluation status of TAs */}
                <Grid
                  sx={{
                    display:"flex",
                    justifyContent:"center"
                  }}

                  item xs={12}
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

                      {/* TA evaluation popup window */}
                      <div>
                        {/* To be added later */}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {/* Bottom left quadrant: bar graph of characteristics selected */}
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
                    <BarChart layout='vertical'  data={improvementData["improvements"]}>
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
              {/* Bottom right quadrant: bar graph of improvements selected */}
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
                    <BarChart  layout='vertical' data={characteristicData["characteristics"]}>
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