import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
//import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, LabelList, ResponsiveContainer } from 'recharts';
import AssessmentTaskDropdown from '../../../../Components/AssessmentTaskDropdown';
import CategoryDropdown from '../../../../Components/CategoryDropdown';
import CharacteristicsAndImprovements from './CharacteristicsAndImprovements';

export default function ViewAssessmentStatus(props: any) {
  // Check if rubrics and category_json exist to prevent null reference errors when no tasks are available
  var categoryList = (props.rubrics && props.rubrics.category_json) 
    ? Object.keys(props.rubrics.category_json)
        .sort((a,b) => props.rubrics.category_json[a].index - props.rubrics.category_json[b].index)
    : [];

    // Ensure chosenAssessmentId is valid when no assessment tasks are available
  const validAssessmentId = (props.assessmentTasks && props.assessmentTasks.length > 0) 
  ? props.chosenAssessmentId 
  : '';

  // Set initial category ID, defaulting to empty string if no categories available
  var [chosenCategoryId, setChosenCategoryId] = useState(categoryList.length > 0 ? categoryList[0] : '');

  const handleChosenCategoryIdChange = (event: any) => {
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

  var characteristicsData: any = {
    'characteristics': []
  };

  var improvementsData: any = {
    'improvements': []
  };

  if (chosenCategoryIdCorrespondsWithRubric) {
    for (let i = 0; i < props.rubrics['category_json'][chosenCategoryId as any]['observable_characteristics'].length; i++) {
      characteristicsData['characteristics'].push({
        'characteristic' : props.rubrics['category_json'][chosenCategoryId as any]['observable_characteristics'][i],
        'number': 0,
      });
    }

    for (let i = 0; i < props.rubrics['category_json'][chosenCategoryId as any]['suggestions'].length; i++) {
      improvementsData['improvements'].push({
        'improvement' : props.rubrics['category_json'][chosenCategoryId as any]['suggestions'][i],
        'number': 0,
      });
    }
  }

  var ratingsData: any = {
    'ratings': [
      {'rating': 0, 'number': 0},
      {'rating': 1, 'number': 0},
      {'rating': 2, 'number': 0},
      {'rating': 3, 'number': 0},
      {'rating': 4, 'number': 0},
      {'rating': 5, 'number': 0},
    ]
  };
  var allRatings: any = [];
  var avg: any = 0;
  var stdev: any = 0;
  var finished = 0;
  var total = props.courseTotalStudents;  //total teams or students
  var progress = 0;
  if (props.completedAssessments && props.completedAssessments.length > 0) {
      for (let i = 0; i < props.completedAssessments.length; i++) {
      if (props.completedAssessments[i].done) {
        finished++;
      }
    }
    progress = +((finished / total) * 100).toFixed(2);
    if (props.completedAssessments !== null && props.completedAssessments.length > 0) {
      // Iterate through each completed assessment for chosen assessment task
      for (var i = 0; i < props.completedAssessments.length; i++) {
        // Only collect data from completed assessment tasks
        if (!props.completedAssessments[i]['done']) 
          continue;

        if (props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'].hasOwnProperty(chosenCategoryId)) {
          // Collect the ratings data
          var oneRating = props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId as any]['rating'];

          allRatings.push(oneRating);
          ratingsData['ratings'][oneRating]['number'] += 1; 

          // Iterate through each observable characteristic within the category and see whether the user checked the box
          for (let j = 0; j < props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId as any]['observable_characteristics'].length; j++) {
            let oc_data = parseInt(props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId as any]['observable_characteristics'][j]);
            characteristicsData['characteristics'][j]['number'] += oc_data;
          }

          // Iterate through each suggestion for improvement within the category and see whether the user checked the box
          for (let j = 0; j < props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId as any]['suggestions'].length; j++) {
            let sugg_data = parseInt(props.completedAssessments[i]['rating_observable_characteristics_suggestions_data'][chosenCategoryId as any]['suggestions'][j]);
            improvementsData['improvements'][j]['number'] += sugg_data;
          }
        } 
      }
    } // End of completedAssessments processing

    
      // calc avg/stdev using allRatings
      if (allRatings.length > 0) {
        avg = (allRatings.reduce((a: any, b: any) => a + b) / allRatings.length).toFixed(2);
        stdev = (Math.sqrt(allRatings.map((x: any) => (x - avg) ** 2).reduce((a: any, b: any) => a + b) / allRatings.length)).toFixed(2);
      }

      // add percentage to each JSON object in improvement/characteristics
      for (let i = 0; i < characteristicsData['characteristics'].length; i++) {
        let percent = total === 0 ? 0 : 
          (characteristicsData['characteristics'][i]['number'] / total * 100);
        characteristicsData['characteristics'][i]['percentage'] = +percent.toFixed(2);
      }
  
      for (let i = 0; i < improvementsData['improvements'].length; i++) {
        let percent = total === 0 ? 0 : 
          (improvementsData['improvements'][i]['number'] / total * 100);
        improvementsData['improvements'][i]['percentage'] = +percent.toFixed(2);
      }
  }
  
  const innerGridStyle = {
    borderRadius: '1px',
    height: '100%',
    border: "#7F7F7F", 
    padding: 0,
    margin: 0,
    boxShadow: "0.3em 0.3em 1em #d6d6d6"
  };

  const innerDivClassName = 'd-flex flex-column p-3 w-100 justify-content-center align-items-center';

  return (
    <Container>
      <Box sx={{ maxHeight:"135vh", display:"flex", alignItems:"center" }} className='d-flex flex-column' aria-label="viewAssessmentStatusBox" >
        <Grid container rowSpacing={0} columnSpacing={4} style={{ width: "95vw",  }}>
        <Grid container item xs={12} spacing={2}>
            <Grid item xs={12} md={6}>
              <div className={innerDivClassName} style={{
                ...innerGridStyle,
                minHeight: '250px'
              }}>
                <h6 style={{ margin: '0', padding: '1px', lineHeight: '1' }}>
                  <u>Distribution of Ratings</u>
                </h6>
                <div style={{ width: '100%', height: '210px', flexGrow: 1 }}>
                  {props.showRatings ? (
                    <ResponsiveContainer>
                      <BarChart
                        layout="horizontal"
                        data={ratingsData.ratings}
                        barCategoryGap={0.5}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="rating" type="category" style={{ fontSize: '0.75rem' }} />
                        <YAxis type="number" domain={[0, 'auto']} style={{ fontSize: '0.75rem' }} />
                        <CartesianGrid vertical={false} />
                        <Bar dataKey="number" fill="#2e8bef">
                          <LabelList dataKey="number" fill="#ffffff" position="inside" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{textAlign: "center"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="190" height="190" fill="grey" className="bi bi-bar-chart" viewBox="0 0 16 16">
                      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    </svg>
                    </div>
                  )}
                </div>
                {props.showRatings && (
                  <h6 style={{ fontSize: '0.8rem', margin: '0', padding: '0', lineHeight: '1' }}>
                    Avg: {avg}; StdDev: {stdev}
                  </h6>
                )}
              </div>
            </Grid>

            <Grid item xs={12} md={6}>
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{
                  ...innerGridStyle,
                  padding: '16px'
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <AssessmentTaskDropdown
                        assessmentTasks={props.assessmentTasks || []}
                        chosenAssessmentId={validAssessmentId}
                        setChosenAssessmentId={props.setChosenAssessmentId}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CategoryDropdown
                        categories={categoryList}
                        chosenCategoryId={chosenCategoryId}
                        setChosenCategoryId={handleChosenCategoryIdChange}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div style={{
                  ...innerGridStyle,
                  padding: '20px',
                  marginTop: '16px',  
                }}>
                  <h3 style={{ fontWeight: 'normal', textAlign: 'center'}}>
                    <u>Assessment Tasks Completed:</u>
                  </h3>
                  <div className="progress" style={{ height: "30px", width: "100%", borderRadius: '50px' }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${progress}%`, backgroundColor: '#2e8bef' }}
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      {progress >= 20 && (
                        <h5>
                          <b style={{ float: 'right', padding: '10px 5px 0 0' }}>{progress}%</b>
                        </h5>
                      )}
                    </div>
                    {progress < 20 && (
                      <h5 style={{ padding: '0 0 0 5px', lineHeight:'30px'}}>
                        <b style={{ color: '#2e8bef'}}>{progress}%</b>
                      </h5>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <div className={innerDivClassName} style={innerGridStyle}>
                <CharacteristicsAndImprovements 
                  dataType="characteristics"
                  characteristicsData={characteristicsData}
                  improvementsData={improvementsData}
                  showSuggestions={props.showSuggestions}
                />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={innerDivClassName} style={innerGridStyle}>
                <CharacteristicsAndImprovements 
                  dataType="improvements"
                  characteristicsData={characteristicsData}
                  improvementsData={improvementsData}
                  showSuggestions={props.showSuggestions}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}