import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

class ViewRatingsTable extends Component {
  render() {
    var allRatings = [];

    let nameLabel = "";
    var assessmentIsTeam = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    // Determines if it is students or teams
    if (assessmentIsTeam[this.props.chosenAssessmentId] === false) {
        nameLabel = "Student Name";
      } else {
        nameLabel = "Team Name";
      }
    this.props.ratings.map((currentRating) => {
      var rating = {};

      if (currentRating["first_name"] && currentRating["last_name"]) {
        rating["name"] = currentRating["first_name"] + " " + currentRating["last_name"];
      } else if (currentRating["team_name"]) {
        rating["name"] = currentRating["team_name"];
        rating["student"] = currentRating["student"]
      }

      rating["feedback_time_lag"] = currentRating["lag_time"];

      if(currentRating["rating_observable_characteristics_suggestions_data"]) {
        Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
          return rating[category] = currentRating["rating_observable_characteristics_suggestions_data"][category]["rating"];
        });

        return allRatings.push(rating);
      }

      return allRatings;
    });

    const columns = [
      {
        name: "name",
        label: nameLabel,
        options: {
          filter: true,
          setCellHeaderProps: () => ({
            style: {
              width: '10%'
            }
          }),
          setCellProps: () => ({
            style: {
              width: '10%'
            }
          })
        }
      },
    ]

    // Add in the rest of the columns with the categories that correspond to the chosen rubric
    this.props.categories.map((i) => {
      if (assessmentIsTeam[this.props.chosenAssessmentId] === false){
        columns.push({
          name: i["category_name"],
          label: i["category_name"],
          options: {
            filter: true,
          }
        });

        return i;

      } else {
        columns.push({
          name: i["category_name"],
          label: i["category_name"],
          options: {
            filter: true,
            customHeadLabelRender: (columnMeta) => {
              return (
                <div 
                  style={{
                    transform: 'rotate(45deg)',
                    transformOrigin: 'center',
                    whiteSpace: 'wrap',
                    height: '150px', 
                    width: '80px',  
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'left'
                  }}
                >
                  {columnMeta.label}
                </div>
              );
            },
            setCellHeaderProps: () => ({
              style: {
                minWidth: '40px',
                maxWidth: '40px',
                padding: '0',      
                margin: '0',       
                height: 'auto', 
                verticalAlign: 'middle'
              }
            })
          }
        });

        return i;
      }
    });

    if (assessmentIsTeam[this.props.chosenAssessmentId] === false) {
      columns.splice(1, 0, {
        name: "feedback_time_lag",
        label: "Feedback Time Lag",
        options: {
          filter: true,
        }
      });
    } else {
      /*
      To-Do:
        Combine student_name and lag_time columns into one as seen in concept art in Jira SKIL-639. Somehow make the 
        feedback_info data from rating_routes.py fit. When Student name has a time lag associated with it set 
        text-color to green . If Student's Lag Time is null, set Lag time value to '-' and Student name text-color to red. 
      */ 
      columns.push({
        name:"student",
        label:"Student",
        options: {
          filter: true,
        }
      },{
        name:"feedback_time_lag",
        label:"Feedback Time Lag",
        options: {
          filter: true,
        }
      });
    }

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%",
    };

    return (
      <MUIDataTable data={allRatings} columns={columns} options={options} />
    );
  }
}

export default ViewRatingsTable;