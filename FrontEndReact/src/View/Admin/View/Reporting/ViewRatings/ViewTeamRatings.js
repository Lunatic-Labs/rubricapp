import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';


//Displays team ratings data in a table format using MUI DataTable. 
// This component renders rating across multiple rubric categories for teams.
// Receives an array of rating objects via props.ratings
//Transforms the nested rating data structure into a flat format suitable for table display

class ViewTeamRatings extends Component {
  render() {
    //Initialize array to hold all process rating rows
    var allRatings = [];
    //BUG: this is being reused acreoss iterations without beign reset this cause data to accumalte incorrectly
    var rating = {};
    //Step 1: transfor rating data from nested structure to flat table
    //Maps thorught each rating object provide by parent
    this.props.ratings.map((currentRating) => {
      //Extract and combine first and last name into a single field
        rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];
        //Step 2: extract rating value form nested data structure
        if(currentRating["rating_observable_characteristics_suggestions_data"]) {
          //itewrated throguh each category in the rating data
          Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
            //Extract the numeric rating value and add it as a column in the row
            return rating[category] = currentRating["rating_observable_characteristics_suggestions_data"][category]["rating"];
          });

          return allRatings.push(rating);
        }
        //Step 3: Add the completed row to the table data array
        return allRatings;
    });
    // Step 4: Define table coiumn structure
    //These categories are hardcoded - should ideallly come from props.categories
    const columns = [
      {
        name: "team_name",
        label: "Team Name",
        options: {
          filter: true,
        }
      },
      {
        name: "Identifying the Goal",
        label: "Identifying the Goal",
        options: {
          filter: true,
        }
      },
      {
        name: "Evaluating",
        label: "Evaluating",
        options: {
          filter: true,
        }
      },
      {
        name: "Analyzing",
        label: "Analyzing",
        options : {
          filter: true,
        }
      },
      {
        name: "Synthesizing",
        label: "Synthesizing",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Structure)",
        label: "Forming Arguments (Structure)",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Validity)",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
          align: "center"
        }
      },
      {
        name: "Feedback Information",
        label: "Feedback Information",
        options: {
          filter: true,
          align: "center"
        }
      }
    ];
    //Step 5: configure table display options
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
    //Step 6: Render the MUI datatable wit processed data
    //MUIDataTable handles sorting, filtering, and pagination automatically
    return (
      <MUIDataTable data={allRatings} columns={columns} options={options}/> //Process rating data, column definitions, and table configuration
    )
  }
}

export default ViewTeamRatings;