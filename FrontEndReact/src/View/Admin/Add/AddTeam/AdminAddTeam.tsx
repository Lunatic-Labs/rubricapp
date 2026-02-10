import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import ErrorMessage from "../../../Error/ErrorMessage";
import { Box, Button, Typography, TextField } from "@mui/material";
import { genericResourcePOST, genericResourcePUT, genericResourceGET } from "../../../../utility";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import Cookies from 'universal-cookie';
import FormHelperText from '@mui/material/FormHelperText';
import Loading from "../../../Loading/Loading";

interface AdminAddTeamState {
    isLoaded: boolean | null;
    errorMessage: string | null;
    validMessage: string;
    editTeam: boolean;
    observerId: string;
    teamName: string;
    users: any[] | null;
    errors: {
        teamName: string;
        observerId: string;
    };
}

class AdminAddTeam extends Component<any, AdminAddTeamState> {
    constructor(props: any) {
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

        var addTeam = state.addTeam;

        genericResourceGET(
            `/user?course_id=${this.props.navbar.state.chosenCourse["course_id"]}&role_id=4`, 
            "users", this);
        
        if (team !== null && !addTeam) {
            this.setState({
                teamName: team["team_name"],

                observerId: team["observer_id"],

                editTeam: true,
            });
        }
    }

    handleSelect = (event: any) => {
        this.setState({
            observerId: event.target.value,
        });
    };

    handleSubmit = () => {
        const { teamName, observerId } = this.state;
        const errors: any = {};

        var date = new Date().getDate();

        var month = new Date().getMonth() + 1;

        var year = new Date().getFullYear();

        var navbar = this.props.navbar;

        var confirmCreateResource = navbar.confirmCreateResource;

        var state = navbar.state;

        var chosenCourse = state.chosenCourse;

        var team = state.team;

        var addTeam = state.addTeam;
    
        if (teamName.trim() === "") {
            errors.teamName = "Team name cannot be empty";
        } else if (teamName.length > 50) {
            errors.teamName = "Team name cannot be more than 50 characters";
        }
    
        if (observerId === "") {
            errors.observerId = "Observer cannot be empty";
        }
    
        if (Object.keys(errors).length > 0) {
            this.setState({ errors });
        } else {
            const body = JSON.stringify({
                team_name: teamName,
                observer_id: observerId,
                course_id: chosenCourse.course_id,
                assessment_task_id: null,
                date_created: `${month}/${date}/${year}`,
                active_until: null,
            });
    
            let promise;

            if (team === null && addTeam === null) {
                promise = genericResourcePOST(`/team?course_id=${chosenCourse.course_id}`, this, body);
            } else if (team !== null && addTeam === false) {
                promise = genericResourcePUT(`/team?team_id=${team.team_id}`, this, body);
            }
            promise?.then(result => {
                if (result !== undefined && result.errorMessage === null) {
                    confirmCreateResource("Team");
                }
            });
        }
    };

    handleChange = (e: any) => {
        const { id, value } = e.target;

        //Define max length for teamName
        const maxLength = 50;

        //Check for validation
        let errorMessage = '';
        if (value.trim() === '') {
            errorMessage = `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty`;
        } else if (id === 'teamName' && value.length > maxLength) {
            errorMessage = `Team name cannot be more than ${maxLength} characters`;
        }

        this.setState({
            [id]: value,

            errors: {
                ...this.state.errors,

                [id]: errorMessage,
            },
        } as any);
    };

    render() {
        const cookies = new Cookies();

        const userId = cookies.get('user')["user_id"];

        const userName = cookies.get('user')["user_name"]

        var instructors: any[] = []; 

        if (this.state.isLoaded){
            if (this.state.users === null) {
                return (
                    <Loading />
                );
            }
            instructors = this.state.users.map((item: any) => { 
                return {
                    id: item["user_id"],
                    firstName: item["first_name"],
                    lastName: item["last_name"]
                }
            });
        }

        var navbar = this.props.navbar;

        const {
            errorMessage,
            errors,
            validMessage,
            teamName,
            observerId
        } = this.state;

        return <>
            { errorMessage &&
                <ErrorMessage
                    errorMessage={errorMessage}
                />
            }

            { validMessage!=="" &&
                <ErrorMessage
                    errorMessage={validMessage}
                />
            }

            <Box style={{ marginTop: "5rem" }} className="card-spacing">
                <Box className="form-position">
                    <Box className="card-style">
                        <FormControl className="form-spacing" aria-label="addTeamForm">
                            <Typography id="addTeamTitle" variant="h5" aria-label={this.state.editTeam ? "adminEditTeamTitle" : "adminAddTeamTitle"}>
                                {this.state.editTeam ? "Edit Team" : "Add Team"}
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
                                    className="text-box-colors"
                                    sx={{
                                    mb: 3,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "var(--textbox-bg)",
                                        color: "var(--textbox-text)",
                                        "& fieldset": {
                                        borderColor: "var(--textbox-border)",
                                        },
                                        "&:hover fieldset": {
                                        borderColor: "var(--textbox-border-hover)",
                                        },
                                        "&.Mui-focused fieldset": {
                                        borderColor: "var(--textbox-border-focused)",
                                        },
                                        '&.Mui-error fieldset': {
                                        borderColor: 'var(--textbox-error)',
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: 'var(--textbox-label)',
                                        '&.Mui-focused': {
                                            color: 'var(--textbox-border-focused)',
                                        },
                                        '&.Mui-error': {
                                            color: 'var(--textbox-error)',
                                        },
                                    },
                                    }}
                                    inputProps={{ maxLength: 50 }}
                                    aria-label="userTeamNameInput"
                                />

                                <FormControl error={!!errors.observerId} required fullWidth 
                                    sx={{
                                        mb: 3,
                                        "& .MuiInputBase-root": {
                                        backgroundColor: "var(--dropdown-bg)",
                                        color: "var(--dropdown-text)",
                                        },
                                        "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "var(--dropdown-border)",
                                        },
                                        "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#ffffff",
                                        },
                                        "& .MuiInputLabel-root": {
                                        color: "var(--dropdown-label)",
                                        },
                                        "& .MuiSelect-icon": {
                                        color: "var(--dropdown-icon)",
                                        },
                                    }}
                                >
                                    <InputLabel className={errors.observerId ? "errorSelect" : ""} id="Observer">Observer</InputLabel>

                                    <Select
                                        id="Observer"
                                        labelId="Observer"
                                        value={observerId}
                                        label="Observer"
                                        onChange={(event: any) => this.handleSelect(event)}
                                        required
                                        error={!!errors.observerId}
                                        aria-label="userObserverDropDown"

                                        MenuProps={{
                                            PaperProps: {
                                                
                                                sx: {
                                                backgroundColor: "var(--dropdown-bg)",
                                                color: "var(--dropdown-text)",
                                                "& .MuiMenuItem-root": {
                                                    "&:hover": {
                                                    backgroundColor: "var(--dropdown-hover)",
                                                    },
                                                    "&.Mui-selected": {
                                                    backgroundColor: "var(--dropdown-selected)",
                                                    "&:hover": {
                                                        backgroundColor: "var(--dropdown-selected)",
                                                    },
                                                    },
                                                },
                                                },
                                            },
                                        }}
                                    >
                                        {navbar.props.isAdmin &&
                                            <MenuItem value={userId} key={userId}>{userName}</MenuItem>
                                        }

                                        {instructors.map((x: any) => <MenuItem value={x.id} key={x.id}>{x.firstName + " " + x.lastName}</MenuItem>
                                        )}
                                    </Select>
                                    <FormHelperText>{errors.observerId}</FormHelperText>
                                </FormControl>


                                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px" }}>
                                    <Button
                                        id="createTeamCancel"
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
                                        id="createTeam"
                                        variant="contained"

                                        onClick={this.handleSubmit}

                                        aria-label="addOrSaveAddTeamButton"
                                    >
                                        {this.state.editTeam ? "Save" : "Add Team"}
                                    </Button>
                                </Box>
                            </Box>
                        </FormControl>
                    </Box>
                </Box>
            </Box>
        </>;
    }
}

export default AdminAddTeam;
