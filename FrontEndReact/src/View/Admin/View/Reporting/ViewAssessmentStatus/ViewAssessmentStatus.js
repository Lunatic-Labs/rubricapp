import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
//import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList } from 'recharts';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown.js';
import CategoryDropdown from '../../../../Components/CategoryDropdown.js';
import CharacteristicsAndImprovements from './CharacteristicsAndImprovements.js';

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

  var progress = 43;

  if (props.completedAssessments !== null && props.completedAssessments.length > 0) {
    // Iterate through each completed assessment for chosen assessment task
    for (var i = 0; i < props.completedAssessments.length; i++) {
      // Only collect data from completed assessment tasks
      if (!props.completedAssessments[i]['done']) 
        continue;

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
      let percent = characteristicsData['characteristics'][i]['number'] / (props.completedAssessments !== null ? props.completedAssessments.length : 1) * 100;

      characteristicsData['characteristics'][i]['percentage'] = percent + "%";
    }

    for (let i = 0; i < improvementsData['improvements'].length; i++) {
      let percent = improvementsData['improvements'][i]['number'] / (props.completedAssessments !== null ? props.completedAssessments.length : 1) * 100;

      improvementsData['improvements'][i]['percentage'] = percent  + "%";
    }
  }
{/*remove border color top and fix it*/}
  const innerGridStyle = {
    borderRadius: '1px',
    border: "#7F7F7F", 
    margin: "2px 2px 2px 0px",
    boxShadow: "0.3em 0.3em 1em #d6d6d6"
  };
  const thinBox  = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: '1px',
    padding: '0'
  };
  const outerQuadrantSX = {
    display:"flex",
    justifyContent:"center"
  };

  const innerDivClassName = 'd-flex flex-column p-3 w-100 justify-content-center align-items-center';
  
  return (
    <Container>
      <Box sx={{ maxHeight:"150vh", display:"flex", alignItems:"center" }} className='d-flex flex-column' aria-label="viewAssessmentStatusBox" >
        <Grid container rowSpacing={0} columnSpacing={4} style={{ width: "95vw" }}>

          <Grid sx={{ display:"flex", marginBottom:'20px'}} item xs={12}>
                { props.showRatings && 
                  <Grid sx={outerQuadrantSX} item xs={6}>
                    <div className={innerDivClassName} style={innerGridStyle}>
                      <h6>Distribution of Ratings</h6>
                        <BarChart width={500} height={300} data={ratingsData["ratings"]} barCategoryGap={0.5}>
                          <XAxis dataKey="rating"/>
                          <YAxis width={40} domain={[0, 'auto']}/>
                          <CartesianGrid vertical={false}/>
                          <Bar dataKey= "number" fill = "#2e8bef">
                            <LabelList dataKey="number" fill="#ffffff" position="inside"/>
                          </Bar>
                        </BarChart>
                        <h6>Avg: {avg}; StdDev: {stdev}</h6>
                    </div>
                  </Grid> 
                }
                
                <div style={{marginLeft:'20px'}}>
                  <Grid item xs={12} sx={{ mb: 2 }}>
                    <div style={{
                      ...innerGridStyle,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: '16px',
                      alignItems: 'center',
                      width: '100%',
                      marginBottom: '20px'
                    }}>
                      <AssessmentTaskDropdown
                        assessmentTasks={props.assessmentTasks}
                        chosenAssessmentId={props.chosenAssessmentId}
                        setChosenAssessmentId={props.setChosenAssessmentId}
                        style={{ flex: 1 }}
                      />
                      <CategoryDropdown
                        categories={categoryList}
                        chosenCategoryId={chosenCategoryId}
                        setChosenCategoryId={handleChosenCategoryIdChange}
                        disabled={props.completedAssessments !== null && props.completedAssessments.length === 0}
                        style={{ flex: 1 }}
                      />
                    </div>
                      <div style={{
                        ...innerGridStyle,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: "20px",
                        height: '100%'
                      }}>
                        <h3>
                          <u>Assessment Tasks Completed:</u>
                        </h3>
                        <div class="progress" style={{height: "35px", width:"100%", borderRadius:'50px',margin:'30px'}}>
                          <div className={"progress-bar"} role={"progressbar"} style={{width: `${progress}%`, backgroundColor:'#2e8bef'}} 
                          aria-valuenow={{progress}} aria-valuemin={0} aria-valuemax={100}>
                            <h5>
                              <b style={{
                                float: 'right', 
                                padding:'10px 10px 0 0'}}>{progress}
                              </b>
                            </h5>
                          </div>
                        </div> 
                      </div>                                    
                  </Grid>

                </div>
                </Grid>
          <Grid sx={{ display:"flex", justifyContent:"center", margin:"0px 0px 0px 0px" }} item xs={6}>
            <div className={innerDivClassName} style={innerGridStyle} >
            <CharacteristicsAndImprovements 
              dataType="characteristics"
              characteristicsData={characteristicsData}
              improvementsData={improvementsData}
              showSuggestions={props.showSuggestions}
            />
            </div>
          </Grid>
          <Grid sx={{ display:"flex", justifyContent:"center", margin:"0px 0px 0px 0px" }} item xs={6}>
            <div className={innerDivClassName} style={innerGridStyle} >
            <CharacteristicsAndImprovements 
              dataType="improvements"
              characteristicsData={characteristicsData}
              improvementsData={improvementsData}
              showSuggestions={props.showSuggestions}
            />
            </div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}