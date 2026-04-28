import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../Components/CustomDataTable";

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

    const columns = [
      {
        name: "teamName",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
        }
      },
      
      {
        name: "studentNames",
        label: "Team Member Names",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px" } },
          setCellProps: () => { return { width:"230px" } },
          customBodyRender: (users: string) => {
            return(
              <p className="pt-3">{users}</p>
            )
          }
        }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem"
    };

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewTeamsTA;
