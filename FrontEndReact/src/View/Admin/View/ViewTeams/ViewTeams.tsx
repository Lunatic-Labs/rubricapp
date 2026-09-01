import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomDataTable from "../../../Components/CustomDataTable";
import { genericResourceDELETE } from "../../../../utility";
import { Team } from '../../../../types/Team';
import { GridColDef } from '@mui/x-data-grid';

/**
 * Creates an instance of the ViewTeams component.
 * 
 * @constructor
 * @param {object} props - The properties passed to the component.
 * @param {Object} props.navbar - A reference to the AppState component, provides access to global navigation, state, and helper methods.
 * @param {Object[]} props.teams - Array of team objects to be displayed. These originate from the API.
 * @param {Object[]} props.users - Array of user objects used to map observer_id → observer name.
 * @param {function(string):void} props.onError - Displays an error message when deletion fails.
 * @param {function(string):void} props.onSuccess - Displays a success message after deletion succeeds.
 * @param {function():void} props.refreshData - Refetches team data after delete or modification.
 */
interface ViewTeamsProps {
    navbar: any;
    teams: Team[] | null;
    users: Record<string, string>;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
    refreshData: () => void;
}

class ViewTeams extends Component<ViewTeamsProps> {
  /**
   * @method deleteTeam - Attempts to delete a team using the backend API.
   * @param {number|string} teamId - The ID of the team to delete.
   */
  async deleteTeam(teamId: number) {
    try {
      const result = await genericResourceDELETE(`/team?team_id=${teamId}`, this, {
        dest: "teams",
      });
      if (result.errorMessage) {
        throw new Error(result.errorMessage);
      }
      //window.alert("Team can be deleted")
      this.props.onSuccess("Team deleted successfully");
      setTimeout(() => {
        this.props.refreshData();
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.message || "Cannot delete team. There are assessment task associated with this team.";
      window.alert(errorMessage);
      this.props.onError(errorMessage);
      setTimeout(() => {
        this.props.refreshData();
      }, 1000);
    }
  }

  render() {
    var navbar = this.props.navbar;
    var adminViewTeams = navbar.adminViewTeams;
    var users = adminViewTeams.users;
    var teams = adminViewTeams.teams;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;
    var setAddTeamTabWithTeam = navbar.setAddTeamTabWithTeam;

    const columns: GridColDef[] = [
      {
        field: "team_name",
        headerName: "Team Name",
        flex: 2,
      },
      {
        field: "observer_id",
        headerName: "Observer Name",
        flex: 3,
        renderCell: (params) => {
          return params.value === chosenCourse["admin_id"] ? (
            <p> Admin </p>
          ) : (
            <p>{users[params.value]}</p>
          );
        },
      },
      {
        field: "date_created",
        headerName: "Date Created",
        flex: 2,
        renderCell: (params) => {
          const date: string = params.value;
          var year = "";
          var month = "";
          var day = "";

          for (var dateIndex = 0; dateIndex < date.length; dateIndex++) {
            if (date[dateIndex] !== "-") {
              if (dateIndex >= 0 && dateIndex < 4) {
                year += date[dateIndex];
              }

              if (dateIndex === 5 || dateIndex === 6) {
                month += date[dateIndex];
              }

              if (dateIndex > 6 && dateIndex < date.length) {
                day += date[dateIndex];
              }
            }
          }
          return <p>{month + "/" + day + "/" + year}</p>;
        },
      },
      {
        field: "edit_action",
        headerName: "Edit",
        flex: 1,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const teamId = params.row.team_id;
          return (
            <IconButton
              onClick={() => {
                setAddTeamTabWithTeam(teams, teamId, users, "AddTeam");
              }}
              aria-label="editTeamIconButton"
            >
              <EditIcon sx={{ color: "black" }} />
            </IconButton>
          );
        },
      },
      {
        field: "delete_action",
        headerName: "Delete",
        flex: 1,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const teamId = params.row.team_id;
          return (
            <IconButton
              onClick={() => {
                if (
                  window.confirm("Are you sure you want to delete this team?")
                ) {
                  this.deleteTeam(teamId);
                }
              }}
              aria-label="deleteTeamIconButton"
            >
              <DeleteIcon sx={{ color: "black" }} />
            </IconButton>
          );
        },
      },
      {
        field: "view_members_action",
        headerName: "View Team Members",
        flex: 1,
        sortable: false,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const teamId = params.row.team_id;
          return (
            <IconButton
              onClick={() => {
                setAddTeamTabWithTeam(teams, teamId, users, "TeamMembers");
              }}
              aria-label="viewTeamsIconButton"
            >
              <VisibilityIcon sx={{ color: "black" }} />
            </IconButton>
          );
        },
      },
    ];

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        getRowId={(row) => row.team_id}
        height="55vh"
      />
    );
  }
}

export default ViewTeams;
