import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CustomDataTable from "../../../Components/CustomDataTable.js";
import { genericResourceDELETE } from "../../../../utility.js";

class ViewTeams extends Component {
  deleteTeam(teamId) {
    console.log("delete team should be called with team id:", teamId);
    try {
      console.log("deleting team with id:", teamId);
      const result = genericResourceDELETE(`/team?team_id=${teamId}`, this, {
        dest: "teams",
      });
      console.log("team deleted successfully");
      if (result && result.status === 200) {
        // Update the teams list after successful deletion
        const updatedTeams = this.state.teams.filter(
          (team) => team.team_id !== teamId,
        );

        this.setState({
          teams: updatedTeams,
          successMessage: "Team deleted successfully.",
          errorMessage: null,
        });
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.setState({ successMessage: null });
        }, 3000);
      }
    } catch (error) {
      this.setState({
        errorMessage:
          "Cannot delete team. There are associated assessment tasks.",
      });
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

    const columns = [
      {
        name: "team_name",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => {
            return { width: "20%" };
          },
          setCellProps: () => {
            return { width: "20%" };
          },
        },
      },
      {
        name: "observer_id",
        label: "Observer Name",
        options: {
          filter: true,
          setCellHeaderProps: () => {
            return { width: "30%" };
          },
          setCellProps: () => {
            return { width: "30%" };
          },
          customBodyRender: (observerId) => {
            return observerId === chosenCourse["admin_id"] ? (
              <p> Admin </p>
            ) : (
              <p>{users[observerId]}</p>
            );
          },
        },
      },
      {
        name: "date_created",
        label: "Date Created",
        options: {
          filter: true,
          setCellHeaderProps: () => {
            return { width: "20%" };
          },
          setCellProps: () => {
            return { width: "20%" };
          },
          customBodyRender: (date) => {
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
      },
      {
        name: "team_id",
        label: "Edit",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          setCellProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          customBodyRender: (teamId) => {
            return (
              <IconButton
                align="center"
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
      },
      {
        name: "team_id",
        label: "Delete",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          setCellProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          customBodyRender: (teamId) => {
            return (
              <IconButton
                align="center"
                onClick={() => {
                  if (
                    window.confirm("Are you sure you want to delete this team?")
                  ) {
                    this.deleteTeam(teamId);
                    console.log("Delete Team should be called ", teamId);
                  }
                }}
                aria-label="deleteTeamIconButton"
              >
                <DeleteIcon sx={{ color: "black" }} />
              </IconButton>
            );
          },
        },
      },
      {
        name: "team_id",
        label: "View Team Members",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          setCellProps: () => {
            return {
              align: "center",
              width: "10%",
              className: "button-column-alignment",
            };
          },
          customBodyRender: (teamId) => {
            return (
              <IconButton
                align="center"
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
      tableBodyMaxHeight: "55vh",
    };

    return (
      <CustomDataTable
        data={teams ? teams : []}
        columns={columns}
        options={options}
      />
    );
  }
}

export default ViewTeams;
