import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from "validator";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

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
        if(this.props.assessment_task && !this.props.addAssessmentTask) {
            document.getElementById("assessmentTaskName").value = this.props.assessment_task["assessment_task_name"];
            this.setState({due_date: new Date(this.props.assessment_task["due_date"])});
            document.getElementById("roleID").value = this.props.role_names[this.props.assessment_task["role_id"]];
            document.getElementById("rubricID").value = this.props.rubric_names[this.props.assessment_task["rubric_id"]];
            document.getElementById("suggestions").checked = this.props.assessment_task["show_suggestions"];
            document.getElementById("ratings").checked = this.props.assessment_task["show_ratings"];
            document.getElementById("addAssessmentTaskTitle").innerText = "Edit Assessment Task";
            document.getElementById("createAssessmentTask").innerText = "Edit Task";
            this.setState({editAssessmentTask: true});
        }
        document.getElementById("createAssessmentTask").addEventListener("click", () => {
            var rubricNames = [];
            for(var r = 1; r < 8; r++) {
                rubricNames = [...rubricNames, this.props.rubric_names ? this.props.rubric_names[r]: ""];
            }
            var message = "Invalid Form: ";
            if(validator.isEmpty(document.getElementById("assessmentTaskName").value)) {
                message += "Missing Assessment Task Name!";
            } else if (validator.isEmpty(document.getElementById("roleID").value)) {
                message += "Missing Role!";
            } else if (!validator.isIn(document.getElementById("roleID").value, ["TA/Instructor", "Student", "Teams"])) {
                message += "Invalid Role!";
            } else if (validator.isEmpty(document.getElementById("rubricID").value)) {
                message += "Missing Rubric!";
            } else if (!validator.isIn(document.getElementById("rubricID").value, rubricNames)) {
                message += "Invalid Rubric!";
            }
            if(message === "Invalid Form: ") {
                var role_id = document.getElementById("roleID").value;
                for(r = 4; r < 8; r++) {
                    if(this.props.role_names[r]===role_id) {
                        role_id = r;
                    }
                }
                var rubric_id = document.getElementById("rubricID").value;
                for(r = 1; r < 8; r++) {
                    if(this.props.rubric_names[r]===rubric_id) {
                        rubric_id = r;
                    }
                }
                fetch(
                    (
                        this.props.addAssessmentTask ?
                        "http://127.0.0.1:5000/api/assessment_task":
                        `http://127.0.0.1:5000/api/assessment_task/${this.props.assessment_task["assessment_task_id"]}`
                    ),
                    {
                        method: this.props.addAssessmentTask ? "POST":"PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            'assessment_task_name': document.getElementById("assessmentTaskName").value,
                            'course_id': this.props.chosenCourse["course_id"],
                            'rubric_id': rubric_id,
                            'role_id': role_id,
                            'due_date': this.state.due_date,
                            'show_suggestions': document.getElementById("suggestions").checked,
                            'show_ratings': document.getElementById("ratings").checked
                    })
                })
                .then(res => res.json())
                .then(
                    (result) => {
                        if(result["success"] === false) {
                            this.setState({
                                errorMessage: result["message"]
                            })
                        }
                    },
                    (error) => {
                        this.setState({
                            error: error
                        })
                    }
                )
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
                if(document.getElementsByClassName("text-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        const { error , errorMessage, validMessage } = this.state;
        var role_options = [];
        if(this.props.role_names) {
            for(var r = 4; r < 7; r++) {
                role_options = [...role_options, <option value={this.props.role_names[r]} key={r}/>];
            }
        }
        var rubric_options = [];
        if(this.props.rubric_names) {
            for(r = 1; r < 8; r++) {
                rubric_options = [...rubric_options, <option value={this.props.rubric_names[r]} key={r}/>];
            }
        }
        return (
            <React.Fragment>
                { error &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new assessment task resulted in an error: { error.message }</h1>
                        </React.Fragment>
                }
                { errorMessage &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new assessment task resulted in an error: { errorMessage }</h1>
                        </React.Fragment>
                }
                { validMessage!=="" &&
                    <React.Fragment>
                        <h1 className="text-danger text-center p-3">{ validMessage }</h1>
                    </React.Fragment>
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
                                <label id="taskTypeLabel">Role</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="roleID" type="text" name="role_id" className="m-1 fs-6" list="roleDataList" placeholder="Role" required/>
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
                            <div className="w-25 p-2 justify-content-between">
                                <label id="suggestionsLabel">Suggestions</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="suggestions" type="checkbox" name="suggestions" className="m-1 fs-6" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="ratingsLabel">Ratings</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="ratings" type="checkbox" name="ratings" className="m-1 fs-6" required/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;