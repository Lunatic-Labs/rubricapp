import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';



class ViewRatingsTable extends Component {
  render() {
    var allRatings = [];

    this.props.ratings.map((currentRating) => {
      var rating = {};

      rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];

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
        name: "student_name",
        label: "Student Name",
        options: {
          filter: true,
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

    // Add in the rest of the columns with the categories that correspond to the chosen rubric
    this.props.categories.map((i) => {
      columns.push({
        name: i['category_name'],
        label: i['category_name'], 
        options: {
          filter: true,
        }
      });

      return i;
    });

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