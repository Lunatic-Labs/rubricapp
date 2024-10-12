import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { Box, Button, Typography, TextField } from "@mui/material";
import { genericResourcePOST, genericResourcePUT, genericResourceGET } from "../../../../utility.js";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import Cookies from 'universal-cookie';
import FormHelperText from '@mui/material/FormHelperText';

class AdminDeleteTeam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: null,
      errorMessage: null,
      validMessage: "",
      editTeam: false,
      observerId: '',
      teamName: "",
      users: null,

      errors: {
        teamName: "",
        observerId: '',
      } 
    }
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
      "users", this);
        
    if (team !== null && !deleteTeam) {
      this.setState({
        teamName: null,

        observerId: null,

        editTeam: false,
      });
    }
  }
}
