import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import ViewTeams from "./ViewTeams.js";
import { genericResourceGET, 
  parseUserNames } from "../../../../utility.js";
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
      prevTeamsLength: 0,
      successMessage: null,
      filtered: false,
    };
  }


  fetchData = () => {
    if(this.state.filtered) return;
    var navbar = this.props.navbar;
    var state = navbar.state;
    var chosenCourse = state.chosenCourse;

    genericResourceGET(
      `/team?course_id=${chosenCourse["course_id"]}`,
      "teams",
      this,
    ).then(response => {
      if (!this.props.navbar.state.chosenCourse.use_fixed_teams){
        const regex = /^Team [0-9]+$/;
        const temp = response.teams.filter(team => !regex.test(team.team_name));
        this.setState({
          filtered: true,
          teams: temp,
        })
      };
    });

    var url = chosenCourse["use_tas"]
      ? `/user?course_id=${chosenCourse["course_id"]}&role_id=4`
      : `/user?uid=${chosenCourse["admin_id"]}`;

    genericResourceGET(url, "users", this);
  };

  componentDidMount() {
    this.fetchData();
  }


  componentDidUpdate(){
    if (this.state.teams && this.state.teams.length !== this.state.prevTeamsLength && !this.state.filtered) {
      this.setState({ prevTeamsLength: this.state.teams.length });
      this.fetchData();
    }
  }
  setErrorMessage = (message) => {
    this.setState({ errorMessage: message });
    // Clear error message after 3 seconds
    setTimeout(() => {
      this.setState({ errorMessage: null });
    }, 3000);
  }

  setSuccessMessage = (message) => {
    this.setState({ successMessage: message });
    // Clear success message after 3 seconds
    setTimeout(() => {
      this.setState({ successMessage: null });
    }, 3000);
  }
  render() {
    const { errorMessage, isLoaded, teams, users, successMessage } = this.state;

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
          {successMessage && (
            <div className="container">
              <SuccessMessage
                successMessage={successMessage}
                aria-label="adminViewTeamsSuccessMessage"
              />
            </div>
          )}
          {errorMessage && (
            <div className="container">
              <ErrorMessage
                fetchedResource={"Teams"}
                errorMessage={errorMessage}
                aria-label="adminViewTeamsErrorMessage"
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
              onError={this.setErrorMessage}
              onSuccess={this.setSuccessMessage}
              refreshData={this.fetchData}
            />
          </Box>
        </Box>
      );
    }
  }
}

export default AdminViewTeams;
