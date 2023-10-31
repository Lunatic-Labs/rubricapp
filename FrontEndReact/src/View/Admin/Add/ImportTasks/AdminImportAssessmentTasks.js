import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import CourseDropdown from './CourseDropdown';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage';

class AdminImportAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            courses: [],
            selectedCourse: ''
        }
        this.setSelectedCourse = (newSelectedCourse) => {
            this.setState({
                selectedCourse: newSelectedCourse
            });
        };
    }
    componentDidMount() {
        document.getElementById("importAssessmentTasks").addEventListener("click", () => {
            // var rubricNames = [];
            // for(var r = 1; r < 8; r++) {
            //     rubricNames = [...rubricNames, this.props.rubric_names ? this.props.rubric_names[r]: ""];
            // }
            // var message = "Invalid Form: ";
            // if(validator.isEmpty(document.getElementById("assessmentTaskName").value)) {
            //     message += "Missing Assessment Task Name!";
            // } else if (validator.isEmpty(document.getElementById("roleID").value)) {
            //     message += "Missing Role!";
            // } else if (!validator.isIn(document.getElementById("roleID").value, ["TA/Instructor", "Student", "Teams"])) {
            //     message += "Invalid Role!";
            // } else if (validator.isEmpty(document.getElementById("rubricID").value)) {
            //     message += "Missing Rubric!";
            // } else if (!validator.isIn(document.getElementById("rubricID").value, rubricNames)) {
            //     message += "Invalid Rubric!";
            // }
            // if(message === "Invalid Form: ") {
            //     var role_id = document.getElementById("roleID").value;
            //     for(r = 4; r < 8; r++) {
            //         if(this.props.role_names[r]===role_id) {
            //             role_id = r;
            //         }
            //     }
            //     var rubric_id = document.getElementById("rubricID").value;
            //     for(r = 1; r < 8; r++) {
            //         if(this.props.rubric_names[r]===rubric_id) {
            //             rubric_id = r;
            //         }
            //     }
            //     fetch(
            //         (
            //             this.props.addAssessmentTask ?
            //             "http://127.0.0.1:5000/api/assessment_task":
            //             `http://127.0.0.1:5000/api/assessment_task/${this.props.assessment_task["assessment_task_id"]}`
            //         ),
            //         {
            //             method: this.props.addAssessmentTask ? "POST":"PUT",
            //             headers: {
            //                 "Content-Type": "application/json"
            //             },
            //             body: JSON.stringify({
            //                 'assessment_task_name': document.getElementById("assessmentTaskName").value,
            //                 'course_id': this.props.chosenCourse["course_id"],
            //                 'rubric_id': rubric_id,
            //                 'role_id': role_id,
            //                 'due_date': this.state.due_date,
            //                 'show_suggestions': document.getElementById("suggestions").checked,
            //                 'show_ratings': document.getElementById("ratings").checked
            //         })
            //     })
            //     .then(res => res.json())
            //     .then(
            //         (result) => {
            //             if(result["success"] === false) {
            //                 this.setState({
            //                     errorMessage: result["message"]
            //                 })
            //             }
            //         },
            //         (error) => {
            //             this.setState({
            //                 error: error
            //             })
            //         }
            //     )
            // When ready to implement logic, remove lines 116-120
            console.log(this.state.selectedCourse);
            var message = "Invalid Form: ";
            if(message === "Invalid Form: ") {
                // console.log("Clicked!");
            } else {
                document.getElementById("importAssessmentTasks").classList.add("pe-none");
                document.getElementById("importAssessmentTasksCancel").classList.add("pe-none");
                document.getElementById("importAssessmentTasksClear").classList.add("pe-none");
                this.setState({validMessage: message});
                setTimeout(() => {
                    document.getElementById("importAssessmentTasks").classList.remove("pe-none");
                    document.getElementById("importAssessmentTasksCancel").classList.remove("pe-none");
                    document.getElementById("importAssessmentTasksClear").classList.remove("pe-none");
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
        const {
            error,
            errorMessage,
            validMessage
        } = this.state;
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="importAssessmentTasksTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Import Assessment Tasks</h1>
                    <div className="d-flex justify-content-around">
                        Please select the course you would like to import assesments tasks from
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="dueDateLabel">Course</label>
                            </div>
                            <div className="d-flex flex-row justify-content-around">
                                {/* Add a dropdown for selecting courses here */}
                                <CourseDropdown
                                    id="courseSelected"
                                    setSelectedCourse={this.setSelectedCourse}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminImportAssessmentTask;