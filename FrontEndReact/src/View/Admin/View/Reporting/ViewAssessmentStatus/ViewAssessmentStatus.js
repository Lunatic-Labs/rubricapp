import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// import ViewTAEval from "./ViewTAEval.js";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown.js';
import CategoryDropdown from '../../../../Components/CategoryDropdown.js';


export default function ViewAssessmentStatus(props) {
    var categoryList = Object.keys(props.rubrics.category_json);

    var [chosenCategoryId, setChosenCategoryId] = useState(categoryList[0]);
    const handleChosenCategoryIdChange = (event) => {
      setChosenCategoryId(event.target.value);
    };

    // When the user changes the assessment task, the chosenCategoryId may not correspond to any selectable
    // category in the new rubric, causing the default value in the CategoryDropdown to be blank (ugly). 
    // This piece of code ensures that the category dropdown always populates with a default value, 
    // and that the default value corresponds to the currently chosen rubric. 
    var chosenCategoryIdCorrespondsWithRubric = props.rubrics.category_json.hasOwnProperty(chosenCategoryId);
    if (!chosenCategoryIdCorrespondsWithRubric) {
      setChosenCategoryId(categoryList[0]);
    }

    var characteristicsData = {
      'characteristics': []
    };
    var improvementsData = {
      'improvements': []
    };
    if (chosenCategoryIdCorrespondsWithRubric) {
      for (let i = 0; i < props.rubrics['category_json'][chosenCategoryId]['observable_characteristics'].length; i++) {
        characteristicsData['characteristics'].push({
          'characteristic' : props.rubrics['category_json'][chosenCategoryId]['observable_characteristics'][i],
          'number': 0,
        });
      }
      for (let i = 0; i < props.rubrics['category_json'][chosenCategoryId]['suggestions'].length; i++) {
        improvementsData['improvements'].push({
          'improvement' : props.rubrics['category_json'][chosenCategoryId]['suggestions'][i],
          'number': 0,
        });
      }
    }

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
    var allRatings = [];
    var avg = 0;
    var stdev = 0;

    if (props.completedAssessments.length > 0) {
      // Iterate through each completed assessment for chosen assessment task
      for (var i = 0; i < props.completedAssessments.length; i++) {
        // Only collect data from completed assessment tasks
        if (!props.completedAssessments[i]['done']) 
          continue; //nec.?

        if (props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'].hasOwnProperty(chosenCategoryId)) {
          // Collect the ratings data
          var oneRating = props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId]['rating'];
          allRatings.push(oneRating);
          ratingsData['ratings'][oneRating]['number'] += 1; 

          // Iterate through each observable characteristic within the category and see whether the user checked the box
          for (let j = 0; j < props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId]['observable_characteristics'].length; j++) {
            let oc_data = parseInt(props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId]['observable_characteristics'][j]);
            characteristicsData['characteristics'][j]['number'] += oc_data;
          }

          // Iterate through each suggestion for improvement within the category and see whether the user checked the box
          for (let j = 0; j < props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId]['suggestions'].length; j++) {
            let sugg_data = parseInt(props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId]['suggestions'][j]);
            improvementsData['improvements'][j]['number'] += sugg_data;
          }
        } 
      }

      // calc avg/stdev using allRatings
      if (allRatings.length > 0) {
        avg = (allRatings.reduce((a, b) => a + b) / allRatings.length).toFixed(2);
        stdev = (Math.sqrt(allRatings.map(x => (x - avg) ** 2).reduce((a, b) => a + b) / allRatings.length)).toFixed(2);
      }

      // add percentage to each JSON object in improvement/characteristics
      for (let i = 0; i < characteristicsData['characteristics'].length; i++) {
        let percent = characteristicsData['characteristics'][i]['number'] / props.completedAssessments.length * 100;
        characteristicsData['characteristics'][i]['percentage'] = percent + "%"; 
      }
      for (let i = 0; i < improvementsData['improvements'].length; i++) {
        let percent = improvementsData['improvements'][i]['number'] / props.completedAssessments.length * 100;
        improvementsData['improvements'][i]['percentage'] = percent  + "%"; 
      }
    }

    console.log(improvementsData);
    console.log(characteristicsData);

    const outerQuadrantStyle = {
      borderRadius: '10px',
      border: "3px #2e8bef",
      borderTopStyle : "solid", 
      margin: "2px 2px 2px 2px",
      boxShadow: "0 2px 0 #d6d6d6"
    };

    const outerQuadrantSX = {
      display:"flex",
      justifyContent:"center"
    };

    const innerDivClassName = 'd-flex flex-column p-3 w-100 justify-content-center align-items-center';

    return (
      <>
        <Container>
          <Box sx={{ maxHeight:"100vh", display:"flex", alignItems:"center",}} className='d-flex flex-column' >
            <Grid container rowSpacing={0} columnSpacing={0} style={{ width: "90vw",}}>

              {/* Top left quadrant: histogram of assessment task ratings */}
              <Grid sx={{ display:"flex", justifyContent:"center", margin:"0px 0px 0px 0px",}} item xs={6}>
                <div className={innerDivClassName} style={outerQuadrantStyle}>

                  <h6>Distribution of Ratings</h6>
                  <h6>Avg: {avg}; StdDev: {stdev}</h6>

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
                sx={{ display:"flex", flexDirection: "column", justifyContent:"center"}} item xs={6}>
                {/* Top half of quadrant: 2 dropdowns */}
                <Grid sx={{ display:"flex", flexDirection: "row", justifyContent:"center"}} item xs={12}>

                  {/* Dropdown #1 */}
                  <Grid sx={outerQuadrantSX} item xs={12}>
                    <div className={innerDivClassName} style={outerQuadrantStyle}> 
                      <AssessmentTaskDropdown
                        assessmentTasks={props.assessmentTasks}
                        chosenAssessmentId={props.chosenAssessmentId}
                        setChosenAssessmentId={props.setChosenAssessmentId}
                      />
                    </div>
                  </Grid>

                  {/* Dropdown #2 */}
                  <Grid sx={outerQuadrantSX} item xs={12}>
                    <div className={innerDivClassName} style={outerQuadrantStyle}> 
                      <CategoryDropdown
                        // categories={props.categories}
                        categories={categoryList}
                        chosenCategoryId={chosenCategoryId}
                        setChosenCategoryId={handleChosenCategoryIdChange}
                        disabled={props.completedAssessments.length === 0}
                      />
                    </div>
                  </Grid>
                </Grid>

              {/* Bottom half of quadrant: evaluation status of students and TAs */}
                <Grid sx={{ display:"flex", flexDirection: "row", justifyContent:"center"}} item xs={12}>

                  {/* Evaluation status of students */}
                  <Grid sx={outerQuadrantSX} item xs={12}>
                    <div className={innerDivClassName} style={outerQuadrantStyle}> 
                      <h1>54% of students (54/100) have completed the rubric</h1>
                    </div>
                  </Grid>

                  {/* Evaluation status of TAs */}
                  <Grid sx={outerQuadrantSX} item xs={12}>
                    <div className={innerDivClassName} style={outerQuadrantStyle}>
                      <h1>43% of TA evaluations (43/100) are complete</h1>
                      <Button style={{ width:"30%", height:"100%",  backgroundColor: "#2E8BEF", color:"white", position: "center"}}>
                          View Details
                      </Button>

                      {/* TA evaluation popup window: to be added later*/}
                      <div>
                      </div>

                    </div>
                  </Grid>
                </Grid>
              </Grid>

              {/* Bottom left quadrant: bar graph of characteristics selected */}
              <Grid sx={outerQuadrantSX} item xs={6}>
                <div className={innerDivClassName} style={outerQuadrantStyle}>
                  <h5>Improvements Selected</h5>

                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart layout='vertical'  data={improvementsData["improvements"]}>
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
              <Grid sx={outerQuadrantSX} item xs={6}>
                <div className={innerDivClassName} style={outerQuadrantStyle}>
                  <h5>Characteristics Selected</h5>

                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout='vertical' data={characteristicsData["characteristics"]}>
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