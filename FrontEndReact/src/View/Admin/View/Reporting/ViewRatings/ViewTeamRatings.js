import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewRatings extends Component {
  render() {
    var allRatings = [];
    var rating = {};
    this.props.ratings.map((currentRating) => {
        rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];
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
    ]
    const options= {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%",
    };
    return (
      <>
       <MUIDataTable data={allRatings} columns={columns} options={options}/>
      </>
    )
  }
}
