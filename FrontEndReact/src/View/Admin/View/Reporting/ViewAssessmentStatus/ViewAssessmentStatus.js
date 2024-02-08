import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ViewTAEval from "./ViewTAEval.js";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, ResponsiveContainer, LabelList } from 'recharts';



export default class ViewAssessmentStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      completed_assessments: this.props.completed_assessments,
      ratings_data: {},
      avg: {},
      stdev: {},
      showWindowPortal: false,
      // chosen_assessment_task: this.state.chosen_assessment_task,
    };

    this.toggleWindowPortal = this.toggleWindowPortal.bind(this);

    this.aggregate_ratings = () => {
      if (this.state.completed_assessments.length > 0) {
        var agg_ratings = new Array(6).fill(0);
        var all_ratings = [];

        for (var i = 0; i < this.state.completed_assessments.length; i++) {

          // Only collect data from completed assessment tasks
          if (!this.state.completed_assessments[i]['done'])
            continue;

          // Otherwise, iterate through each category and collect the data
          for (var category in this.state.completed_assessments[i]['rating_observable_characteristics_suggestions_data']) {
            
            // Skip categories that don't pertain to assessment tasks
            if (category === 'comments' || category === 'done')
              continue; 

            var one_rating = this.state.completed_assessments[i]['rating_observable_characteristics_suggestions_data'][category]['rating'];
            
            all_ratings.push(one_rating);
            agg_ratings[one_rating] += 1; 
          }
        }

        // Create the json object that will store the data to display
        this.state.ratings_data['ratings'] = [];

        for (i = 0; i < 6; i++) {
          var obj = {};

          obj['rating'] = i;
          obj['number'] = agg_ratings[i]; 

          this.state.ratings_data['ratings'].push(obj);
        }

        // calc avg/stdev using all_ratings
        this.state.avg = (all_ratings.reduce((a, b) => a + b) / all_ratings.length).toFixed(2);
        this.state.stdev = (Math.sqrt(all_ratings.map(x => (x - this.state.avg) ** 2).reduce((a, b) => a + b) / all_ratings.length)).toFixed(2);

      } else {
        // default state if there are no completed assessments that meet the criteria
        this.state.ratings_data['ratings'] = [];

        for (i = 0; i < 6; i++) {
          obj = {};

          obj['rating'] = i;
          obj['number'] = 0; 

          this.state.ratings_data['ratings'].push(obj);
        }

        this.state.avg = 0;
        this.state.stdev = 0;
      }
    }
  }

  toggleWindowPortal() {
    this.setState(state => ({
      ...state,
      showWindowPortal: !state.showWindowPortal,
    }));
  }

  render() {
    var characteristic_data = {
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

    var improvement_data = {
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

    const columns = [
      {
        name: "course_name",
        label: "Course Name",
        options: {
          filter: true,
        }
      },
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
        }
      },
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
        }
      },
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%"
    };

    return (
      <Container>
        <Box
          sx={{
              maxHeight:"100vh",
              display:"flex",
              alignItems:"center",
          }}

          className='d-flex flex-column'
          onClick={this.aggregate_ratings()}
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
                  Avg: {this.state.avg}; StdDev: {this.state.stdev}
                </h6>

                <ResponsiveContainer width="100%" height="100%">
                  <BarChart  data={this.state.ratings_data["ratings"]} barCategoryGap={0.5}>
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
                    <h1>Flap</h1>
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
                    <h1>Flap</h1>
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

                      onClick={this.toggleWindowPortal}
                    >
                      {this.state.showWindowPortal ? 'Hide' : 'View'} Details
                    </Button>

                    {/* TA evaluation popup window */}
                    <div>
                      {this.state.showWindowPortal && (
                        <ViewTAEval>
                          <p>Even though I render in a different window, I share state!</p>

                          <MUIDataTable data={[]} columns={columns} options={options}/>

                          <button onClick={() => this.setState({ showWindowPortal: false })} >
                            Close Portal
                          </button>
                        </ViewTAEval>
                      )}
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
    )
  }
}