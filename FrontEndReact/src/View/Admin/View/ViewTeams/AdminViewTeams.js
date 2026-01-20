import "bootstrap/dist/css/bootstrap.css";
import React, { Component } from "react";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import ViewTeams from "./ViewTeams.js";
import { genericResourceGET, 
  parseUserNames } from "../../../../utility.js";
import { Box, Button, Typography } from "@mui/material";
import Loading from "../../../Loading/Loading.js";
import SuccessMessage from "../../../Success/SuccessMessage.js";

/**
 * Creates an instance of the AdminViewTeams component.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.navbar - The global AppState navigation controller.
 * This object is an instance of the AppState component and provides global navigation, shared state, and helper methods used throughout the system.
 * 
 * @property {Object} props.navbar.state - Global navigation state from AppState.
 * @property {Object|null} props.navbar.state.chosenCourse - The course whose teams are being viewed.
 * @property {number} props.navbar.state.chosenCourse.course_id - Used when fetching teams from the API.
 * @property {boolean|string} props.navbar.state.chosenCourse.use_fixed_teams - Determines whether system-generated teams (e.g., "Team 1") should be filtered out.
 * @property {boolean} props.navbar.state.chosenCourse.use_tas - Controls whether team observers are TAs or only the admin.
 * @property {number} props.navbar.state.chosenCourse.admin_id - Used when fetching the admin user if TAs are not used.
 * @property {function(string):void} props.navbar.setNewTab - Navigates between major UI sections (e.g., to Bulk Upload).
 * @property {function(Object[]):void} props.navbar.setAddTeamTabWithUsers - Opens the "Add Team" page with a preloaded list of users.
 * @property {Object} props.navbar.adminViewTeams - A shared data container used by ViewTeams to access fetched teams and users from this component.
 * @property {Object[]|null} props.navbar.adminViewTeams.teams - Teams loaded by AdminViewTeams, passed to ViewTeams via navbar.
 * @property {Object[]|null} props.navbar.adminViewTeams.users - Users loaded by AdminViewTeams, passed to ViewTeams via navbar.
 * 
 * @property {string|null} state.errorMessage - Stores the current error message displayed to the user. It is set when an API request fails and automatically cleared after 3 seconds.
 * @property {string|null} state.successMessage - Stores a temporary success message shown after successful team operations (e.g., deleting a team). Also auto-clears after 3 seconds.
 * @property {boolean} state.isLoaded - Indicates whether both the team list and user list have finished loading. Prevents rendering the table until all data is available.
 * @property {Object[]|null} state.teams - The list of teams returned from the API. May be filtered to remove system-generated names such as “Team 1” depending on course settings.
 * @property {Object[]|null} state.users - The list of users permitted to act as team observers. Populated based on whether the course uses TAs or only the course administrator.
 * @property {number} state.prevTeamsLength - Tracks the number of teams previously loaded. Used to detect when teams have been added/removed so that data can be refetched.
 * @property {boolean} state.filtered - Marks whether system-generated team names have already been removed from the team list. Prevents repeating the filter operation.
 */
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


  /**
   * @method fetchData - Fetches teams and users from the API and applies filtering rules.
   */
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

  /**
   * @method componentDidMount - React lifecycle method that runs once after the component is first mounted.
   * Initializes the view by fetching:
   *  - The list of teams for the selected course
   *  - The list of users eligible to serve as team observers
   *
   * Ensures all required data is loaded before rendering the team table.
   */
  componentDidMount() {
    this.fetchData();
  }


  /**
   * @method componentDidUpdate - React lifecycle method that runs after every component update.
   * Detects changes in the number of loaded teams and triggers a refetch
   * when needed—such as after adding, deleting, or bulk uploading teams.
   *
   * Refetching is performed only when:
   *  - Team data exists
   *  - The number of teams has changed since the last render
   *  - The list has not yet been filtered (prevents infinite re-fetch loops)
   *
   * Keeps the displayed team list synchronized with backend state.
   */
  componentDidUpdate(){
    if (this.state.teams && this.state.teams.length !== this.state.prevTeamsLength && !this.state.filtered) {
      this.setState({ prevTeamsLength: this.state.teams.length });
      this.fetchData();
    }
  }

  /**
   * @method setErrorMessage - Stores an error message and clears it after 3 seconds.
   * @param {string} message - Error message text.
   */
  setErrorMessage = (message) => {
    this.setState({ errorMessage: message });
    // Clear error message after 3 seconds
    setTimeout(() => {
      this.setState({ errorMessage: null });
    }, 3000);
  }

  /**
   * @method setSuccessMessage - Stores a success message and clears it after 3 seconds.
   * @param {string} message - Success message text.
   */
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
