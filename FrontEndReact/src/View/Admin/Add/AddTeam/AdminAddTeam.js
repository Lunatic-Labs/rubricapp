import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';

class AdminAddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editTeam: false
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;
        var adminViewTeams = navbar.adminViewTeams;
        var users = adminViewTeams.users;
        var team = state.team;
        var addTeam = state.addTeam;
        var first_last_names_list = adminViewTeams.first_last_names_list;
        if(chosenCourse["use_tas"] && users && Object.keys(users).length === 0) {
            document.getElementById("addTeamTitle").innerText = "At least 1 TA is required to create Teams.";
            document.getElementById("createTeam").setAttribute("disabled", true);
            document.getElementById("createTeam").classList.add("pe-none");
            document.getElementById("createTeamClear").setAttribute("disabled", true);
            document.getElementById("createTeamClear").classList.add("pe-none");
            document.getElementById("teamName").setAttribute("disabled", true);
            document.getElementById("teamName").classList.add("pe-none");
            document.getElementById("observerID").setAttribute("disabled", true);
            document.getElementById("observerID").classList.add("pe-none");
        }
        if(team!==null && !addTeam) {
            document.getElementById("teamName").value = team["team_name"];
            var observer_name = "";
            document.getElementById("observerID").value = users[team["observer_id"]];
            document.getElementById("observerID").value = observer_name;

            if(!chosenCourse["use_tas"]) {
                document.getElementById("observerID").setAttribute("disabled", true);
                document.getElementById("observerID").classList.add("pe-none");
            }
            document.getElementById("addTeamTitle").innerText = "Edit Team";
            document.getElementById("createTeam").innerText = "EDIT TEAM";
            this.setState({editTeam: true});
        }
        document.getElementById("createTeam").addEventListener("click", () => {
            var success = true;
            var message = "Invalid Form: ";
            var found = false;
            Object.keys(this.props.users).map((user_id) => {
                if(validator.equals(document.getElementById("observerID").value, this.props.users[user_id])) {
                    found = true;
                }
                return found;
            });
            if(success && document.getElementById("observerID").getAttribute("disabled")) {
                success = false;
                message += "Create at least one TA before you can add a team!";
            } else if(success && validator.isEmpty(document.getElementById("teamName").value)) {
                success = false;
                message += "Missing Team Name!";
            } else if (success && validator.isEmpty(document.getElementById("observerID").value)) {
                success = false;
                message += "Missing Observer!";
            } else if (success && !found) {
                success = false;
                message += "Invalid Observer!";
            }
            if(success) {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var newObserverID = document.getElementById("observerID").value;
                var observer_id = -1;

                Object.keys(users).map((user_id) => {
                    if(validator.equals(newObserverID, users[user_id])) {
                        observer_id = user_id;
                    }
                    return observer_id;
                });

                let body = JSON.stringify({
                    "team_name": document.getElementById("teamName").value,
                    "observer_id": observer_id,
                    "course_id": chosenCourse["course_id"],
                    "date_created": month+'/'+date+'/'+year,
                    "active_until": null
                });

                if (addTeam)
                    genericResourcePOST(`/team?course_id=${chosenCourse["course_id"]}`, this, body);
                else 
                    genericResourcePUT(`/team?team_id=${team["team_id"]}`, this, body);
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
        var adminViewTeams = navbar.adminViewTeams;
        var users = adminViewTeams.users;
        var TAsOrInstructors = [];
        Object.keys(users).map((user_id) => {
            return TAsOrInstructors = [...TAsOrInstructors, <option value={users[user_id]} key={user_id}></option>]
        });

        var state = navbar.state;
        var addTeam = state.addTeam;
        var chosenCourse = state.chosenCourse;

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
                    {
                        (
                            (chosenCourse["use_tas"] && users && users.length>0) ||
                            (!chosenCourse["use_tas"] && users)
                        ) &&
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
                                    <div className="w-25 p-2 justify-content-between" style={{}}>
                                        <label id="observerIDLabel">Observer</label>
                                    </div>
                                    <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                        <input type="text" id="observerID" name="newObserverID" className="m-1 fs-6" style={{}} list="observerDataList" placeholder="" required/>
                                        <datalist id="observerDataList" style={{}}>
                                            {TAsOrInstructors}
                                        </datalist>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddTeam;