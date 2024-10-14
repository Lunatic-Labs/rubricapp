import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { Box, Button, Typography} from "@mui/material";
import {genericResourceDelete,genericResourceGET} from "../../../../utility.js";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
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
    const { selectedTeamId, selectedTeamUsers } = this.state;
    const errors = {};
    if (!selectedTeamId) {
      errors.selectedTeamId = "Please select team to delete";
    } else if (selectedTeamUsers.length > 0) {
      errors.selectedTeamId =
        "Please make sure that there are currently no one in the teams before deleting team";
    }
    if (Object.keys(errors).length) {
      this.setState({ errors });
    } else {
      this.deleteTeam(selectedTeamId);
    }
  };

  deleteTeam = (teamId) => {
    genericResourceDelete(
      `/team?team_id=${teamId}`,
      this,
      () => {
        this.setState({
          isRemoved: true,
          validMessage: "The team was successfully deleted",
          selectedTeamId: "",
          selectedTeamUsers: [],
        });
        this.fetchTeams();
      },
      (error) => {
        this.setState({
          errorMessage: `Failed to delete team: ${error.message}`,
        });
      },
    );
  };
  render() {
    const { errorMessage, validMessage, selectedTeamId, errors } = this.state;
    return (
      <>
        {errorMessage && (
          <ErrorMessage
            delete={true}
            resource={"Team"}
            errorMessage={errorMessage}
          />
        )}
        {validMessage && (<ErrorMessage delete={true} error={validMessage} />)}
        <Box style={{ marginTop: "5rem" }} className="card-spacing">
          <Box className="form-position">
            <Box className="card-style">
              <FormControl className="form-spacing" aria-label="deleteTeamForm">
                <Typography
                  id="deleteTeamTitle"
                  variant="h5"
                  aria-label="adminDeleteTeamTitle"
                >
                  Delete Team
                </Typography>

                <Box className="form-input">
                  <FormControl
                    error={!!errors.selectedTeamId}
                    required
                    fullWidth
                    sx={{ mb: 3 }}
                  >
                    <InputLabel id="teamSelect">
                      Select Team to Delete
                    </InputLabel>
                    <Select
                      labelId="teamSelect"
                      value={selectedTeamId}
                      label="Select Team to Delete"
                      onChange={this.handleSelect}
                      error={!!errors.selectedTeamId}
                      aria-label="teamSelectDropdown"
                    >
                      {teams.map((team) => ( //Fix this here (teams is not defined)
                        <MenuItem value={team.team_id} key={team.team_id}>
                          {team.team_name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{errors.selectedTeamId}</FormHelperText>
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
                      onClick={() => {
                        this.props.navbar.setState({
                          activeTab: "Teams",
                          team: null,
                          addTeam: null,
                        });
                      }}
                      aria-label="cancelDeleteTeamButton"
                    >
                      Cancel
                    </Button>

                    <Button
                      id="deleteTeam"
                      variant="contained"
                      color="error"
                      onClick={this.handleSubmit}
                      aria-label="confirmDeleteTeamButton"
                    >
                      Delete Team
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
export default AdminDeleteTeam