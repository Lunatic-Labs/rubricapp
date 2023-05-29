import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from "validator";

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editAssessmentTask: false
        }
    }
    componentDidMount() {
        if(!this.props.addAssessmentTask) {
            document.getElementById("assessmentTaskName").value = this.props.assessment_task["assessment_task_name"];
            document.getElementById("dueDate").value = this.props.assessment_task["due_date"];
            document.getElementById("roleID").value = this.props.assessment_task["role_id"];
            document.getElementById("rubricID").value = this.props.assessment_task["rubric_id"];
            document.getElementById("suggestions").checked = this.props.assessment_task["show_suggestions"];
            document.getElementById("addAssessmentTaskTitle").innerText = "Edit Assessment Task";
            document.getElementById("createAssessmentTask").innerText = "Edit Task";
            this.setState({editAssessmentTask: true});
        }
        document.getElementById("createAssessmentTask").addEventListener("click", () => {
            var message = "Invalid Form: ";
            if(validator.isEmpty(document.getElementById("assessmentTaskName").value)) {
                message += "Missing Assessment Task Name!";
            } else if (validator.isEmpty(document.getElementById("dueDate").value)) {
                message += "Missing Due Date!";
            } else if (validator.isEmpty(document.getElementById("roleID").value)) {
                message += "Missing Role ID!";
            } else if (validator.isEmpty(document.getElementById("rubricID").value)) {
                message += "Missing Rubric ID!";
            }
            if(message === "Invalid Form: ") {
                fetch(this.props.addAssessmentTask ? "http://127.0.0.1:5000/api/assessment_task":`http://127.0.0.1:5000/api/assessment_task/${this.props.assessment_task["assessment_task_id"]}`,
                    {
                        method: this.props.addAssessmentTask ? "POST":"PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            'assessment_task_name': document.getElementById("assessmentTaskName").value,
                            'course_id': this.props.course["course_id"],
                            'rubric_id': document.getElementById("rubricID").value,
                            'role_id': document.getElementById("roleID").value,
                            'due_date': document.getElementById("dueDate").value,
                            'show_suggestions': document.getElementById("suggestions").checked
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
    // componentDidUpdate() {
        // This is where we will update the role name and course number and rubric name!
    // }
    render() {
        const { error , errorMessage, validMessage } = this.state;
        // var currentDate = new Date().getDate(); //To get the Current Date
        // var month = new Date().getMonth() + 1; //To get the Current Month
        // var year = new Date().getFullYear(); //To get the Current Year
        // console.log(currentDate,'/',month,'/',year);
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
                                <input type="text" id="dueDate" name="newDueDate" className="m-1 fs-6" style={{width:"100%"}} placeholder="mm/dd/yyyy" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="taskTypeLabel">Role ID</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="roleID" type="text" name="role_id" className="m-1 fs-6" placeholder="Role ID" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="rubricIDLabel">Rubric ID</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input id="rubricID" type="text" name="rubricID" className="m-1 fs-6" placeholder="Rubric ID" required/>
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
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;