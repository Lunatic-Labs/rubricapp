import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { Box, Button, Typography, TextField } from "@mui/material";
import { genericResourcePOST, genericResourcePUT, genericResourceGET } from "../../../../utility.js";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import Cookies from 'universal-cookie';
import FormHelperText from '@mui/material/FormHelperText';