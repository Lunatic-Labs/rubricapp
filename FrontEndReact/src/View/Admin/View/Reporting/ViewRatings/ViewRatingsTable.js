import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';

//Displays rating in a dynamic, flexable table that supports both indivdual students and teams
// Dynamically, generates columns based on the rubric's categories, making it more maintainable than ViewTeamRqating.js
//Determines if the assessment is tem-based or indivdual using utility function
//Sets appropriate name label 
class ViewRatingsTable extends Component {
  render() {
    //Initialize array to hold all processed rating rows
    var allRatings = [];
    //Step 1: Determine if this assessment is for teams of indivduals
    //Uses utility function that returns an object like: {assessment_id: true/false}
    let nameLabel = "";
    var assessmentIsTeam = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    // Set appropriate column header based on assessment type
    if (assessmentIsTeam[this.props.chosenAssessmentId] === false) {
        nameLabel = "Student Name";
      } else {
        nameLabel = "Team Name";
      }

      //Step 2: Transform ratiing data fom API format to table row format
    this.props.ratings.map((currentRating) => {
      //Create fresh rating object for this row
      var rating = {};

      //Step 2a: Extract name based on assessment type
      //Indivdual assessments have first_name and last_name
      //Team assessments have team_name

      if (currentRating["first_name"] && currentRating["last_name"]) {
        rating["name"] = currentRating["first_name"] + " " + currentRating["last_name"];
      } else if (currentRating["team_name"]) {
        rating["name"] = currentRating["team_name"];
      }

      //Step 2b: Determine feedback timing information
      //If notification was sent, show the lag time
      //Otherwise, show "not notified"

      if (currentRating["notification_sent"]) {
        rating["feedback_time_lag"] = currentRating["lag_time"];
      } else {
        rating["feedback_time_lag"] = "Not notified";
      }

      //Step 2c: Extract rating values from nested data structure
      //Same structure as ViewTeamRatings.js

      if(currentRating["rating_observable_characteristics_suggestions_data"]) {
        Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
          return rating[category] = currentRating["rating_observable_characteristics_suggestions_data"][category]["rating"];
        });
        //Step 2d: Add completed row to table data

        return allRatings.push(rating);
      }
      //
      return allRatings;
    });

      //Step 3: Define base table columns (Name and Feedback timing)
    const columns = [
      {
        name: "name",
        label: nameLabel,     //Dynamic: "Student Name" or "Team Name"
        options: {
          filter: true,       //Enable filtering on this column
        }
      },
      {
        name: "feedback_time_lag",
        label: "Feedback Time Lag",
        options: {
          filter: true,
        }
      },
    ]

    //Atep 4: Dynamically add rubric category columns
    // This is the KEy advantage ove ViewTeaamRating.js
    //Columns are generated from the actual rubric data

    this.props.categories.map((i) => {
      columns.push({
        name: i["category_name"],     //Uses actual category name for  rubric
        label: i["category_name"],
        options: {
          filter: true,
        }
      });

      return i;
    });
    //Step 5: configure table display options
    const options = {
      onRowsDelete: false,              //Disable row deletion
      download: false,                  //Disable download button  
      print: false,                     //Disbale print button
      viewColumns: false,               //Disbale column viewe toggle
      selectableRows: "none",           //Disbale row selection
      selectableRowsHeader: false,      //Hide selection header
      responsive: "standard",           //Standard responsive behavior
      tableBodyMaxHeight: "70%",        //Limit table height to 70% of container
    };
    //Step 6: Render the MUI DataTable
    return (
      <MUIDataTable data={allRatings} columns={columns} options={options} />
    );
  }
}

export default ViewRatingsTable;