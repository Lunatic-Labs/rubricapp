import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
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
        if(this.props.chosenCourse["use_tas"] && this.props.users && this.props.users.length===0) {
            document.getElementById("addTeamTitle").innerText = "At least 1 TA is required to create Teams.";
            document.getElementById("createTeam").setAttribute("disabled", true);
            document.getElementById("createTeam").classList.add("pe-none");
            document.getElementById("createTeamClear").setAttribute("disabled", true);
            document.getElementById("createTeamClear").classList.add("pe-none");
        }
        if(this.props.team!==null && !this.props.addTeam) {
            document.getElementById("teamName").value = this.props.team["team_name"];
            var observer_name = "";
            var users = this.props.chosenCourse["use_tas"] ? this.props.users:this.props.users;
            for(var u = 0; u < users.length; u++) {
                if(users[u]["user_id"]===this.props.team["observer_id"]) {
                    observer_name = users[u]["first_name"] + " " + users[u]["last_name"];
                }
            }
            document.getElementById("observerID").value = observer_name;
            if(!this.props.chosenCourse["use_tas"]) {
                document.getElementById("observerID").classList.add("pe-none");
            }
            document.getElementById("addTeamTitle").innerText = "Edit Team";
            document.getElementById("createTeam").innerText = "EDIT TEAM";
            this.setState({editTeam: true});
        }
        document.getElementById("createTeam").addEventListener("click", () => {
            var message = "Invalid Form: ";
            if(document.getElementById("observerID").getAttribute("disabled")) {
                message += "Create at least one TA before you can add a team!";
            } else if(validator.isEmpty(document.getElementById("teamName").value)) {
                message += "Missing Team Name";
            } else if (validator.isEmpty(document.getElementById("observerID").value)) {
                message += "Missing Observer";
            } else if (!validator.isIn(document.getElementById("observerID").value, this.props.first_last_names_list)) {
                message += "Invalid Observer";
            }
            if(message==="Invalid Form: ") {
                var date = new Date().getDate();
                var month = new Date().getMonth() + 1;
                var year = new Date().getFullYear();
                var newObserverID = document.getElementById("observerID").value;
                var observer_id = -1;
                var users = this.props.chosenCourse["use_tas"] ? this.props.users : this.props.users;
                for(var o = 0; o < users.length; o++) {
                    if(observer_id===-1 && newObserverID.includes(users[o]["first_name"]) && newObserverID.includes(users[o]["last_name"])) {
                        observer_id = users[o]["user_id"];
                    }
                }
                
                let body = JSON.stringify({
                    "team_name": document.getElementById("teamName").value,
                    "observer_id": observer_id,
                    "date_created": month+'/'+date+'/'+year
                });
                if(this.props.addTeam)
                    genericResourcePOST(`/team?course_id=${this.props.chosenCourse["course_id"]}`, this, body);
                else 
                    genericResourcePUT(`/team?team_id=${this.props.team["team_id"]}`, this, body);
                
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
        var TAsOrInstructors = [];
        var users = this.props.chosenCourse["use_tas"] ? this.props.users:this.props.users;
        if (users!==null) {
            for(var u = 0; u < users.length; u++) {
                TAsOrInstructors = [...TAsOrInstructors, <option value={users[u]["first_name"] + " " + users[u]["last_name"]} key={u}/>]
            }
        }
        const {
            error,
            errorMessage,
            validMessage
        } = this.state;
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={this.props.addTeam}
                        resource={"Team"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={this.props.addTeam}
                        resource={"Team"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={this.props.addTeam}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="addTeamTitle" className='d-flex justify-content-around' style={{margin:".5em auto auto auto"}}>Add Team</h1>
                    {
                        (
                            (this.props.chosenCourse["use_tas"] && this.props.users && this.props.users.length>0) ||
                            (!this.props.chosenCourse["use_tas"] && this.props.users)
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