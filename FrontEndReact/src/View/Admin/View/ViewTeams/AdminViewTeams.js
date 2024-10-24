import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import ViewTeams from "./ViewTeams.js";
import {
  genericResourceGET,
  parseUserNames,
  // genericResourceDELETE,
} from "../../../../utility.js";
import { Box, Button, Typography } from "@mui/material";
import Loading from "../../../Loading/Loading.js";
import SuccessMessage from "../../../Success/SuccessMessage.js";

class AdminViewTeams extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: null,
      isLoaded: false,
      teams: null,
      users: null,
    };
    // this.deleteTeam = this.deleteTeam.bind(this);
    //this.delete_selected_teams = this.delete_selected_teams.bind(this);
  }

  componentDidMount() {
    var navbar = this.props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    genericResourceGET(
      `/team?course_id=${chosenCourse["course_id"]}`,
      "teams",
      this,
    );

    var url = chosenCourse["use_tas"]
      ? `/user?course_id=${chosenCourse["course_id"]}&role_id=4`
      : `/user?uid=${chosenCourse["admin_id"]}`;

    genericResourceGET(url, "users", this);
  }

  // async deleteTeam(teamId) {

  //     try {
  //        // First, check if there are any associated assessment tasks
  //        const assessmentTasks = await genericResourceGET(`/assessment_task?team_id=${teamId}`);

  //        if (assessmentTasks.length > 1) {
  //            this.setState({
  //                errorMessage: "Cannot delete team. There are associated assessment tasks."
  //                });
  //                return;
  //            }

  //        // If no associated tasks, proceed with deletion
  //        await genericResourceDELETE(`/team/${teamId}`);

  //        // Update the teams list
  //        const updatedTeams = this.state.teams.filter(team => team.team_id !== teamId);
  //        this.setState({
  //            teams: updatedTeams,
  //            successMessage: "Team deleted successfully."
  //        });

  //            // Clear success message after 4 seconds
  //        setTimeout(() => {
  //            this.setState({ successMessage: null });
  //        }, 3001);

  //        } catch (error) {
  //            this.setState({
  //            errorMessage: `Error deleting team: ${error.message}`
  //        });
  //    }
  // }

  render() {
    const { errorMessage, isLoaded, teams, users } = this.state;

    var navbar = this.props.navbar;

    navbar.adminViewTeams.teams = teams;
    navbar.adminViewTeams.users = users ? parseUserNames(users) : [];

    var setNewTab = navbar.setNewTab;
    var setAddTeamTabWithUsers = navbar.setAddTeamTabWithUsers;

    if (errorMessage) {
      return (
        <div className="container">
          <ErrorMessage fetchedResource={"Teams"} errorMessage={errorMessage} />
        </div>
      );
    } else if (!isLoaded || !teams || !users) {
      return <Loading />;
    } else {
      return (
        <Box>
          {navbar.state.successMessage !== null && (
            <div className="container">
              <SuccessMessage
                successMessage={navbar.state.successMessage}
                aria-label="adminViewTeamsSuccessMessage"
              />
            </div>
          )}
          <Box sx={{ mb: "20px" }} className="subcontent-spacing">
            <Typography sx={{ fontWeight: "700" }} variant="h5">
              Teams
            </Typography>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Button
                className="primary-color"
                variant="contained"
                onClick={() => {
                  setNewTab("AdminTeamBulkUpload");
                }}
                aria-label="adminBulkUploadButton"
              >
                Team Bulk Upload
              </Button>
              <Button
                className="primary-color"
                variant="contained"
                onClick={() => {
                  setAddTeamTabWithUsers(users);
                }}
                aria-label="adminAddTeamButton"
              >
                Add Team
              </Button>
            </Box>
          </Box>
          <Box className="table-spacing">
            <ViewTeams
              navbar={this.props.navbar}
              teams={teams}
              users={users ? parseUserNames(users) : []}
            />
          </Box>
        </Box>
      );
    }
  }
}

export default AdminViewTeams;
