import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { Box, Button, Typography, TextField } from "@mui/material";
import {
  genericResourceDelete,
  genericResourceGET,
} from "../../../../utility.js";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import Cookies from "universal-cookie";
import FormHelperText from "@mui/material/FormHelperText";

class AdminDeleteTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRemoved: null,
      errorMessage: null,
      validMessage: "",
      teams: [],
      selectedTeamId: "",
      selectedTeamUsers: [],

      errors: {
        selectedTeamId: "",
      },
    };
  }

  componentDidMount() {
    this.fetchTeams();
  }

  fetchTeams = () => {
    genericResourceGET(
      `/teams?course_id=${this.props.navbar.state.chosenCourse["course_id"]}`,
      "teams",
      this,
    );
  };

  fetchTeamUsers = (teamId) => {
    genericResourceGET(
      `/team-users?team_id=${teamId}`,
      "selectedTeamUsers",
      this,
    );
  };

  handleSelect = (event) => {
    const teamId = event.target.value;
    this.setState({
      selectedTeamId: teamId,
      errors: {
        ...this.state.errors,
        selectedTeamId: "",
      },
    });
    if (teamId) {
      this.fetchTeamUsers(teamId);
    }
  };

  handleSubmit = () => {
    const { teamName, observerId, users } = this.state;
    const errors = {};

    var date = new Date().getDate();

    var month = new Date().getMonth() + 1;

    var year = new Date().getFullYear();

    var navbar = this.props.navbar;

    var state = navbar.state;

    var confirmDeleteResource = navbar.confirmDeleteResource;

    var chosenCourse = state.chosenCourse;

    var team = state.team;

    var teamusers = state.teamusers;

    var deleteTeam = state.deleteTeam;

    if (users > 0) {
      errors.users = "there needs to be no students in the teams at all";
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      const body = JSON.stringify({
        team_name: teamName,
        observer_id: observerId,
        course_id: chosenCourse.course_id,
        date_deleted: `${month}/${date}/${year}`,
      });

      if (team === null && teamusers === null && deleteTeam === null) {
        genericResourcePOST(
          `/team?course_id=${chosenCourse.course_id}`,
          this,
          body,
        );
      } else if (team !== null && teamusers === null && deleteTeam === false) {
        genericResourcePUT(`/team?team_id=${team.team_id}`, this, body);
      }
      confirmDeleteResource("Team");
    }
  };

  handleChange = (e) => {
    const { id, value } = e.target;
    this.setState({
      [id]: value,
      errors: {
        ...this.state.errors,
        [id]:
          value.trim() === ""
            ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`
            : "",
      },
    });
  };

  render() {
    const cookies = new Cookies();

    const userId = cookies.get("user")["user_id"];

    const userName = cookies.get("user")["user_name"];

    var instructor = [];

    if (this.state.isRemoved) {
      instructor = this.state.users.map((item) => {
        return {
          id: item[null],
          firstName: item[null],
          lastName: item[null],
        };
      });
    }
    var navbar = this.prop.navbar;
    var state = navbar.state;
    var deleteTeam = state.deleteTeam;

    const { errorMessage, errors, validMessage, teamName, observerId } =
      this.state;
    return (
      <>
        {errorMessage && (
          <ErrorMessage
            delete={deleteTeam}
            resource={"Team"}
            errorMessage={errorMessage}
          />
        )}

        {validMessage !== "" && (
          <ErrorMessage delete={deleteTeam} error={validMessage} />
        )}

        <Box style={{ marginTop: "5rem" }} className="card-spacing">
          <Box className="form-position">
            <Box className="card-style">
              <FormControl className="form-spacing" aria-label="addTeamForm">
                <Typography
                  id="deleteTeamTitle"
                  variant="h5"
                  aria-label={
                    this.state.editTeam
                      ? "adminEditTeamTitle"
                      : "adminDeleteTeamTitle"
                  }
                >
                  {this.state.editTeam ? "Edit Team" : "Delete Team"}
                </Typography>

                <Box className="form-input">
                  <TextField
                    id="teamName"
                    name="newTeamName"
                    variant="outlined"
                    label="Team Name"
                    fullWidth
                    value={teamName}
                    error={!!errors.teamName}
                    helperText={errors.teamName}
                    onChange={this.handleChange}
                    required
                    sx={{ mb: 3 }}
                    aria-label="userTeamNameInput"
                  />

                  <FormControl
                    error={!!errors.observerId}
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                  >
                    <InputLabel
                      className={errors.observerId ? "errorSelect" : ""}
                      id="Observer"
                    >
                      Observer
                    </InputLabel>

                    <Select
                      id="Observer"
                      labelId="Observer"
                      value={observerId}
                      label="Observer"
                      onChange={(event) => this.handleSelect(event)}
                      required
                      error={!!errors.observerId}
                      aria-label="userObserverDropDown"
                    >
                      {navbar.props.isAdmin && (
                        <MenuItem value={userId} key={userId}>
                          {userName}
                        </MenuItem>
                      )}

                      {instructor.map((x) => (
                        <MenuItem value={x.id} key={x.id}>
                          {x.firstName + " " + x.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.observerId}</FormHelperText>
                  </FormControl>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      gap: "20px",
                    }}
                  >
                    <Button
                      id="deleteTeamCancel"
                      className=""
                      onClick={() => {
                        navbar.setState({
                          activeTab: "Teams",
                          team: null,
                          addTeam: null,
                        });
                      }}
                      aria-label="cancelAddTeamButton"
                    >
                      Cancel
                    </Button>

                    <Button
                      id="deleteTeam"
                      variant="contained"
                      onClick={this.handleSubmit}
                      aria-label="addOrSaveDeleteTeamButton"
                    >
                      {this.state.editTeam ? "Save" : "Delete Team"}
                    </Button>
                  </Box>
                </Box>
              </FormControl>
            </Box>
          </Box>
        </Box>
      </>
    );
  }
}

export default AdminDeleteTeam;
