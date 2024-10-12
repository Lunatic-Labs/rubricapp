import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { Box, Button, Typography, TextField } from "@mui/material";
import {
  genericResourcePOST,
  genericResourcePUT,
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
      editTeam: false,
      observerId: "",
      teamName: "",
      users: null,

      errors: {
        users: null,
        teamName: "",
        observerId: "",
      },
    };
    this.handleSelect = (event) => {
      this.setState({
        observerId: event.target.value,
      });
    };
  }

  componentDidMount() {
    var navbar = this.props.navbar;

    var state = navbar.state;

    var team = state.team;

    var deleteTeam = state.deleteTeam;

    genericResourceGET(
      `/user?course_id=${this.props.navbar.state.chosenCourse["course_id"]}&role_id=4`,
      "users",
      this,
    );

    if (team !== null && !deleteTeam) {
      this.setState({
        teamName: null,

        observerId: null,

        editTeam: false,
      });
    }
  }

  handleSelect = (event) => {
    this.setState({
      observerId: event.target.value,
    });
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
      errors.users = "there needs to be no users at all";
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
    return;
  }
}
