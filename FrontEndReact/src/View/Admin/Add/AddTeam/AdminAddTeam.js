import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { Box, Button, Typography, TextField } from '@mui/material';
import { genericResourcePOST, genericResourcePUT, genericResourceGET } from '../../../../utility.js';
import { FormControl, MenuItem, InputLabel, Select} from '@mui/material';



class AdminAddTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: null,
            errorMessage: null,
            validMessage: "",
            editTeam: false,
            observerId: "",
            teamName: "",
            users: null,

            errors: {
                teamName: "",
                observerId: "",
            }
        }

        this.handleSelect = (event) => {
            this.setState({
                observerId: event.target.value,
            })
          };
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var team = state.team;
        var addTeam = state.addTeam;
       

        genericResourceGET(`/user?course_id=${this.props.navbar.state.chosenCourse["course_id"]}&role_id=4`, 'users', this);
        
        if (team !== null && !addTeam) {
            this.setState({
                teamName: team["team_name"],
                observerId: team["observer_id"],
                editTeam: true,
            });
        }
    }

    handleSelect = (event) => {
        this.setState({
            observerId: event.target.value,
        });
    };

    handleSubmit = () => {
        const { teamName, observerId } = this.state;
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();


        var navbar = this.props.navbar;
        var confirmCreateResource = navbar.confirmCreateResource;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var team = state.team;
        var addTeam = state.addTeam;
    
        if (teamName.trim() === '' || observerId === '') {
          this.setState({
            errors: {
              teamName: 'Team name cannot be empty',
              observerId: 'Observer cannot be empty'
            },
          });

        } else if (teamName.length > 11) {
            this.setState({
                errors: {
                  teamName: 'Team name cannot be more than 11 characters',
                },
              });
        }

        else {
            var body = JSON.stringify({
                "team_name": teamName,
                "observer_id": observerId,
                "course_id": chosenCourse["course_id"],
                "date_created": month + '/' + date + '/' + year,
                "active_until": null,
          });
    
          if (team === null && addTeam === null) {
            genericResourcePOST(`/team?course_id=${chosenCourse["course_id"]}`, this, body);

          } else if (team !== null && addTeam === false) {
                genericResourcePUT(`/team?team_id=${team["team_id"]}`, this, body);
          }
          confirmCreateResource("Team");
        }
    };

    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState({
            [id]: value,
            errors: {
                ...this.state.errors,
                [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
            },
        });
    };

   
    render() {

        var instructors = []; 

        if (this.state.isLoaded){
            instructors = this.state.users.map((item) => { 
                return {
                    id: item["user_id"],
                    firstName: item["first_name"],
                    lastName: item["last_name"]
                }
            });
        }

        var navbar = this.props.navbar;
        var state = navbar.state;
        var addTeam = state.addTeam;

        const {
            errorMessage,
            errors,
            validMessage,
            teamName,
            observerId
        } = this.state;

        return (
            <React.Fragment>
                { errorMessage &&
                    <ErrorMessage
                        add={addTeam}
                        resource={"Team"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={addTeam}
                        error={validMessage}
                    />
                }
                <Box style={{ marginTop: "5rem" }} className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <Typography id="addTeamTitle" variant="h5">
                                    {this.state.editTeam ? "Edit Team" : "Add Team"}
                                </Typography>
                                <Box className="form-input">
                                    <TextField
                                        id="teamName"
                                        name="newTeamName"
                                        variant='outlined'
                                        label="Team Name"
                                        fullWidth
                                        value={teamName}
                                        error={!!errors.teamName}
                                        helperText={errors.teamName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 3 }}
                                    />

                                    <FormControl fullWidth>
                                        <InputLabel id="Observer">Observer</InputLabel>
                                        <Select
                                            id="Observer"
                                            value={observerId}
                                            label="Observer"
                                            onChange={(event)=> this.handleSelect(event)}
                                            required
                                            error={!!errors.observerId}
                                            sx={{mb: 3}}
                                        >
                                            {instructors.map((x)=>
                                            <MenuItem value={x.id} key={x.id}>{x.firstName + " " + x.lastName}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                                        <Button
                                            onClick={() => {
                                                navbar.setState({
                                                    activeTab: "Teams",
                                                    team: null,
                                                    addTeam: null,
                                                });
                                            }}
                                            id="createTeamCancel"
                                            className=""
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            onClick={this.handleSubmit}
                                            id="createTeam"
                                            variant="contained"
                                        >
                                            {this.state.editTeam ? "Save" : "Add Team"}
                                        </Button>
                                    </Box>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default AdminAddTeam;