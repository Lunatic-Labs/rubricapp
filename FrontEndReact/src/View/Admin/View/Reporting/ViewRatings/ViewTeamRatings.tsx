// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module 'mui-datatables' or its corresp... Remove this comment to see the full error message
import MUIDataTable from 'mui-datatables';



class ViewTeamRatings extends Component {
  props: any;
  render() {
    var allRatings: any = [];
    var rating = {};

    this.props.ratings.map((currentRating: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];

        if(currentRating["rating_observable_characteristics_suggestions_data"]) {
          Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
    ];

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
      // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
      <MUIDataTable data={allRatings} columns={columns} options={options}/>
    )
  }
}

export default ViewTeamRatings;