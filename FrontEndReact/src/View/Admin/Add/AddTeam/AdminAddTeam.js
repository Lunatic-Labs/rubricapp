import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT, genericResourceGET } from '../../../../utility';
import { FormControl, MenuItem, InputLabel, Select} from '@mui/material';

class AdminAddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: null,
            errorMessage: null,
            validMessage: "",
            editTeam: false,
            observer_id: null,
            users: null
        }

        this.handleSelect = (event) => {
            this.setState({
                observer_id: event.target.value,
            })
          };
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var users = this.state.users;
        var team = state.team;
        var addTeam = state.addTeam;

        genericResourceGET(`/user?course_id=${this.props.navbar.state.chosenCourse["course_id"]}&role_id=4`, 'users', this);

        if(chosenCourse["use_tas"] && users && Object.keys(users).length === 0) {
            document.getElementById("addTeamTitle").innerText = "At least 1 TA is required to create Teams.";
            document.getElementById("createTeam").setAttribute("disabled", true);
            document.getElementById("createTeam").classList.add("pe-none");
            document.getElementById("createTeamClear").setAttribute("disabled", true);
            document.getElementById("createTeamClear").classList.add("pe-none");
            document.getElementById("teamName").setAttribute("disabled", true);
            document.getElementById("teamName").classList.add("pe-none");
            document.getElementById("observerID").setAttribute("disabled", true);
        }

        if(team!==null && !addTeam) {
            console.log(team)
            document.getElementById("teamName").value = team["team_name"];
            this.setState({
                observer_id: team["observer_id"]
            });
            document.getElementById("addTeamTitle").innerText = "Edit Team";
            document.getElementById("createTeam").innerText = "EDIT TEAM";

            this.setState({editTeam: true});
        }
        document.getElementById("createTeam").addEventListener("click", () => {
            var success = true;
            var message = "Invalid Form: ";

            if(success && validator.isEmpty(document.getElementById("teamName").value)) {
                success = false;
                message += "Missing Team Name!";
            } else if (success && this.state.observer_id === null) {
                success = false;
                message += "Missing Observer!";
            } 

            if(success) {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var newObserverID = this.state.observer_id;

                let body = JSON.stringify({
                    "team_name": document.getElementById("teamName").value,
                    "observer_id": newObserverID,
                    "course_id": chosenCourse["course_id"],
                    "date_created": month+'/'+date+'/'+year,
                    "active_until": null
                });

                if(team === null && addTeam === null) {
                    genericResourcePOST(`/team?course_id=${chosenCourse["course_id"]}`, this, body);
                } else if (team !== null && addTeam === false) {
                    genericResourcePUT(`/team?team_id=${team["team_id"]}`, this, body);
                }

            } else {
                document.getElementById("createTeam").classList.add("pe-none");
                document.getElementById("createTeamCancel").classList.add("pe-none");
                document.getElementById("createTeamClear").classList.add("pe-none");

                this.setState({validMessage: message});

                setTimeout(() => {
                    document.getElementById("createTeam").classList.remove("pe-none");
                    document.getElementById("createTeamCancel").classList.remove("pe-none");
                    document.getElementById("createTeamClear").classList.remove("pe-none");
                    this.setState({validMessage: ""});
                }, 2000);
            }

            setTimeout(() => {
                if(document.getElementsByClassName("alert-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }

    render() {
        var navbar = this.props.navbar;

        var instructors = []; 

        if (this.state.isLoaded){
            instructors = this.state.users.map((item) => { 
                return {
                    id: item.user_id, 
                    first_name: item.first_name,
                    last_name: item.last_name
                }
            });
        }

        var state = navbar.state;
        var addTeam = state.addTeam;

        const {
            error,
            errorMessage,
            validMessage
        } = this.state;

        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={addTeam}
                        resource={"Team"}
                        errorMessage={error.message}
                    />
                }
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
                <div id="outside">
                    <h1 id="addTeamTitle" className='d-flex justify-content-around' style={{margin:".5em auto auto auto"}}>Add Team</h1>
                        <>
                            <div className="d-flex justify-content-around">Please add a new team or edit the current team</div>
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="w-25 p-2 justify-content-between" style={{}}>
                                        <label id="teamNameLabel">Team Name</label></div>
                                    <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                        <input type="text" id="teamName" name="newTeamName" className="m-1 fs-6" style={{}} placeholder="Team Name" required/>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex flex-column">
                                <div className="d-flex flex-row justify-content-between">
                                    <div className="w-50 p-2 justify-content-between" style={{}}>
                                    <FormControl fullWidth>
                                        <InputLabel id="Observer">Observer</InputLabel>
                                        <Select
                                            labelId="Observer"
                                            id="observer"
                                            value={this.state.observer_id}
                                            label="Observer"
                                            onChange={this.handleSelect}
                                            required
                                            sx={{mb: 3}}
                                        >
                                            {instructors.map((x)=>
                                            <MenuItem value={x.id}>{x.first_name + " " + x.last_name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                    </div>
                                </div>
                            </div>
                        </>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddTeam;