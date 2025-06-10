import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { parseAssessmentIndividualOrTeam } from '../../../../../utility';


class ViewRatingsTable extends Component {
  render() {
    var allRatings = [];
    let nameLabel = "";
    var assessmentIsTeam = parseAssessmentIndividualOrTeam(this.props.assessmentTasks);
    // Determines if it is students or teams
    if (assessmentIsTeam[this.props.chosenAssessmentId] == false) {
        nameLabel = "Student Name";
      } else {
        nameLabel = "Team Name";
      }

    this.props.ratings.map((currentRating) => {
      var rating = {};
      // console.log("Current Rating:", currentRating);
      if (currentRating["first_name"] && currentRating["last_name"]) {
        rating["name"] = currentRating["first_name"] + " " + currentRating["last_name"];
      } else if (currentRating["team_name"]) {
        rating["name"] = currentRating["team_name"];
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
        name: i["category_name"],
        label: i["category_name"],
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