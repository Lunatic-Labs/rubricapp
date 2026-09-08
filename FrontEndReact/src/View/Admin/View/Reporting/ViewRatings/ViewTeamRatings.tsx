import React, { Component } from 'react';
import CustomDataTable from '../../../../Components/CustomDataTable';
import { GridColDef } from '@mui/x-data-grid';

interface ViewTeamRatingsProps {
    navbar: any;
    ratings: unknown[];
}

class ViewTeamRatings extends Component<ViewTeamRatingsProps> {
  render() {
    var allRatings: Record<string, unknown>[] = [];

    this.props.ratings.map((currentRating: any, index: number) => {
        var rating: Record<string, unknown> = { _row_id: index };
        rating["student_name"] = currentRating["first_name"] + " " + currentRating["last_name"];

        if(currentRating["rating_observable_characteristics_suggestions_data"]) {
          Object.keys(currentRating["rating_observable_characteristics_suggestions_data"]).map((category) => {
            return rating[category] = currentRating["rating_observable_characteristics_suggestions_data"][category]["rating"];
          });

          return allRatings.push(rating);
        }

        return allRatings;
    });

    const columns: GridColDef[] = [
      {
        field: "team_name",
        headerName: "Team Name",
        width: 160,
      },
      {
        field: "Identifying the Goal",
        headerName: "Identifying the Goal",
        width: 200,
      },
      {
        field: "Evaluating",
        headerName: "Evaluating",
        width: 150,
      },
      {
        field: "Analyzing",
        headerName: "Analyzing",
        width: 150,
      },
      {
        field: "Synthesizing",
        headerName: "Synthesizing",
        width: 150,
      },
      {
        field: "Forming Arguments (Structure)",
        headerName: "Forming Arguments (Structure)",
        width: 220,
      },
      {
        field: "Forming Arguments (Validity)",
        headerName: "Forming Arguments (Validity)",
        width: 220,
        align: "center",
        headerAlign: "center",
      },
      {
        field: "Feedback Information",
        headerName: "Feedback Information",
        width: 220,
        align: "center",
        headerAlign: "center",
      }
    ];

    return (
      <CustomDataTable
        data={allRatings}
        columns={columns}
        getRowId={(row) => row._row_id}
        height="70%"
      />
    )
  }
}

export default ViewTeamRatings;