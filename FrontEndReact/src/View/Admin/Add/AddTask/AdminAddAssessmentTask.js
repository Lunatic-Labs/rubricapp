import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from "validator";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editAssessmentTask: false,
            due_date: new Date()
        }
    }
    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var assessment_task = state.assessment_task;
        var addAssessmentTask = state.addAssessmentTask;
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;
        var role_names = adminViewAssessmentTask.role_names;
        var rubric_names = adminViewAssessmentTask.rubric_names;
        var chosenCourse = state.chosenCourse;
        if(assessment_task && !addAssessmentTask) {
            document.getElementById("assessmentTaskName").value = assessment_task["assessment_task_name"];
            document.getElementById("timezone").value = assessment_task["time_zone"];
            document.getElementById("roleID").value = role_names[assessment_task["role_id"]];
            document.getElementById("rubricID").value = rubric_names[assessment_task["rubric_id"]];
            document.getElementById("notes").value = assessment_task["comment"];
            document.getElementById("suggestions").checked = assessment_task["show_suggestions"];
            document.getElementById("ratings").checked = assessment_task["show_ratings"];
            document.getElementById("using_teams").checked = assessment_task["unit_of_assessment"];
            document.getElementById("teamPassword").value = assessment_task["create_team_password"];
            document.getElementById("addAssessmentTaskTitle").innerText = "Edit Assessment Task";
            document.getElementById("createAssessmentTask").innerText = "Edit Task";
            this.setState({
                due_date: new Date(assessment_task["due_date"]),
                editAssessmentTask: true
            });
        }
        document.getElementById("createAssessmentTask").addEventListener("click", () => {
            var rubricFound = false;
            Object.keys(rubric_names).map((rubric) => {
                if (rubric_names[rubric] === document.getElementById("rubricID").value) {
                    rubricFound = true;
                }
                return rubricFound;
            });
            var success = true;
            var message = "Invalid Form: ";
            if(success && validator.isEmpty(document.getElementById("assessmentTaskName").value)) {
                success = false;
                message += "Missing Assessment Task Name!";
            } else if (success && validator.isEmpty(document.getElementById("roleID").value)) {
                success = false;
                message += "Missing Role!";
            } else if (success && !validator.isIn(document.getElementById("roleID").value, ["TA/Instructor", "Student"])) {
                success = false;
                message += "Invalid Role!";
            } else if (success && validator.isEmpty(document.getElementById("rubricID").value)) {
                success = false;
                message += "Missing Rubric!";
            } else if (success && !rubricFound){
                success = false;
                message += "Invalid Rubric!";
            }
            if(success) {
                var rubric_id;
                Object.keys(rubric_names).map((rubric) => {
                    if (rubric_names[rubric] === document.getElementById("rubricID").value) {
                        rubric_id = rubric;
                    }
                    return rubric;
                });
                var role_id;
                Object.keys(role_names).map((role) => {
                    if (role_names[role] === document.getElementById("roleID").value) {
                        role_id = role;
                    }
                    return role_id;
                });
                let body = JSON.stringify({
                    'assessment_task_name': document.getElementById("assessmentTaskName").value,
                    'course_id': chosenCourse["course_id"],
                    'rubric_id': rubric_id,
                    'role_id': role_id,
                    'due_date': this.state.due_date,
                    'time_zone': document.getElementById("timezone").value,
                    'show_suggestions': document.getElementById("suggestions").checked,
                    'show_ratings': document.getElementById("ratings").checked,
                    'unit_of_assessment': document.getElementById("using_teams").checked,
                    'create_team_password': document.getElementById("teamPassword").value,
                    'comment': document.getElementById("notes").value
                });

                if(addAssessmentTask)
                    genericResourcePOST("/assessment_task", this, body);
                else 
                    genericResourcePUT(`/assessment_task?assessment_task_id=${assessment_task["assessment_task_id"]}`, this, body);
            } else {
                document.getElementById("createAssessmentTask").classList.add("pe-none");
                document.getElementById("createAssessmentTaskCancel").classList.add("pe-none");
                document.getElementById("createAssessmentTaskClear").classList.add("pe-none");
                this.setState({validMessage: message});
                setTimeout(() => {
                    document.getElementById("createAssessmentTask").classList.remove("pe-none");
                    document.getElementById("createAssessmentTaskCancel").classList.remove("pe-none");
                    document.getElementById("createAssessmentTaskClear").classList.remove("pe-none");
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
        var adminViewAssessmentTask = navbar.adminViewAssessmentTask;
        var role_names = adminViewAssessmentTask.role_names;
        var rubric_names = adminViewAssessmentTask.rubric_names;
        var addAssessmentTask = adminViewAssessmentTask.addAssessmentTask;

        var timezone_options = [
            <option value={"EST"} key={0}/>,
            <option value={"CST"} key={1}/>,
            <option value={"MST"} key={2}/>,
            <option value={"PST"} key={3}/>
        ];

        var role_options = [];

        Object.keys(role_names).map((role) => {
            if(role_names[role]==="TA/Instructor" || role_names[role]==="Student") {
                role_options = [...role_options, <option value={role_names[role]} key={role}/>];
            }
            return role;
        });

        var rubric_options = [];

        Object.keys(rubric_names).map((rubric) => {
            rubric_options = [...rubric_options, <option value={rubric_names[rubric]} key={rubric}/>];
            return rubric;
        });

        const {
            error,
            errorMessage,
            validMessage
        } = this.state;

        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="addAssessmentTaskTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add Assessment Task</h1>
                    <div className="d-flex justify-content-around">
                        Please add a new task or edit the current assesment task
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="taskNameLabel">Task Name</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="assessmentTaskName" name="newTaskName" className="m-1 fs-6" style={{}} placeholder="Task Name" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="dueDateLabel">Due Date</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around">
                                <DatePicker
                                    selected={this.state.due_date}
                                    onSelect={(date) => {
                                        this.setState({due_date: date});
                                    }}
                                    onChange={(date) => {
                                        this.setState({due_date: date});
                                    }}
                                    showTimeSelect
                                    dateFormat={"Pp"}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="taskTypeLabel">Time Zone</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="timezone" type="text" name="time_zone" className="m-1 fs-6" list="timezoneDataList" placeholder="Time Zone" required/>
                                <datalist
                                    id="timezoneDataList"
                                    style={{}}
                                >
                                    {timezone_options}
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="taskTypeLabel">Completed By</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="roleID" type="text" name="role_id" className="m-1 fs-6" list="roleDataList" placeholder="Assessor" required/>
                                <datalist
                                    id="roleDataList"
                                    style={{}}
                                >
                                    {role_options}
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="rubricIDLabel">Rubric</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="rubricID" type="text" name="rubricID" className="m-1 fs-6" list="rubricDataList" placeholder="Rubric" required/>
                                <datalist
                                    id="rubricDataList"
                                >
                                    {rubric_options}
                                </datalist>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="passwordLabel">Password to create teams</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="teamPassword" name="teamPassword" className="m-1 fs-6" style={{}} placeholder="Password"/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="notesLabel">Notes</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <textarea id="notes" type="text" name="notes" className="m-1 w-100 fs-6"  placeholder="Notes"/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="suggestionsLabel">Show Suggestions for Improvement</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="suggestions" type="checkbox" defaultChecked={true} name="suggestions" className="m-1 fs-6" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="ratingsLabel">Show Ratings</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="ratings" type="checkbox" defaultChecked={true} name="ratings" className="m-1 fs-6" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="suggestionsLabel">Using teams</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="using_teams" type="checkbox" defaultChecked={false} name="teams" className="m-1 fs-6" required/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;
