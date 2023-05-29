import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from 'validator';

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
        if(this.props.team!==null) {
            document.getElementById("teamName").value = this.props.team["team_name"];
            document.getElementById("observerID").value = this.props.team["observer_id"];
            document.getElementById("date").value = this.props.team["date"];
            this.setState({editTeam: true});
        }
        document.getElementById("createTeam").addEventListener("click", () => {
            var message = "Invalid Form: ";
            if(validator.isEmpty(document.getElementById("teamName").value)) {
                message += "Missing Team Name";
            } else if (validator.isEmpty(document.getElementById("observerID").value)) {
                message += "Missing Observer ID";
            } else if (validator.isEmpty(document.getElementById("date").value)) {
                message += "Missing Date";
            }
            if(message==="Invalid Form: ") {
                fetch(this.props.addTeam ? "http://127.0.0.1:5000/api/team":`http://127.0.0.1:5000/api/team${this.props.team["team_id"]}`,
                {
                    method: this.props.addTeam ? "POST":"PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "team_name": document.getElementById("teamName").value,
                        "observer_id": document.getElementById("observerID").value,
                        "date": document.getElementById("date").value
                    })
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result["success"]===false) {
                            this.setState({
                                errorMessage: result["message"]
                            })
                        }
                    },
                    (error) => {
                        this.setState({
                            error: error
                        });
                    }
                )
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
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        const { error, errorMessage, validMessage } = this.state;
        return(
            <React.Fragment>
                { error &&
                    <h1 className='text-danger text-center p-3'>Creating a new team resulted in an error: { error.message }</h1>
                }
                { errorMessage &&
                    <h1 className='text-danger text-center p-3'>Creating a new team resulted in an error: { errorMessage }</h1>
                }
                { validMessage!=="" &&
                    <h1 className='text-danger text-center p-3'>{ validMessage }</h1>
                }
                <div id="outside">
                    <h1 id="addTeamTitle" className='d-flex justify-content-around' style={{margin:".5em auto auto auto"}}>Add Team</h1>
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
                                <label id="observerIDLabel">Observer ID</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="observerID" name="newObserverID" className="m-1 fs-6" style={{}} placeholder="e.g. 1" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="dateLabel">Date</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="date" name="newDate" className="m-1 fs-6" style={{}} placeholder="e.g. mm/dd/yy" required/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddTeam;