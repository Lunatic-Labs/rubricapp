import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";
import { GridColDef } from '@mui/x-data-grid';

/**
 * @description
 * Read-only table of teams for TA/observer view.
 *
 * Responsibilities:
 *  - Receives a simplified teams[] array built in TAViewTeams:
 *      { teamName: string, studentNames: string }
 *  - Renders a CustomDataTable showing team names and member names.
 *
 * Props:
 *  @prop {Array} teams - List of team summary objects.
 *
 * Notes:
 *  - No fetches occur here; input is purely via props.
 *  - Sorting is handled by CustomDataTable (columns are filterable;
 *    any sort options use default behavior).
 */

interface TATeam {
    team_id: number;
    teamName: string;
    studentNames: string;
}

interface ViewTeamsTAProps {
    navbar?: any;
    teams?: TATeam[];
    users?: Record<string, string>;
}

class ViewTeamsTA extends Component<ViewTeamsTAProps> {
  render() {
    var teams = this.props.teams;

    const columns: GridColDef[] = [
      {
        field: "teamName",
        headerName: "Team Name",
        width: 230,
      },
      {
        field: "studentNames",
        headerName: "Team Member Names",
        width: 230,
        renderCell: (params) => (
          <p className="pt-3">{params.value}</p>
        )
      },
    ];

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        getRowId={(row) => row.team_id}
        height="21rem"
      />
    )
  }
}

export default ViewTeamsTA;
