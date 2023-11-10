import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST, genericResourcePUT } from '../../../../utility';
import Cookies from 'universal-cookie';
                                      
class AdminAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editCourse: false
        }
    }
    componentDidMount() {
        if(this.props.course!==null && !this.props.addCourse) {
            document.getElementById("courseName").value = this.props.course["course_name"];
            document.getElementById("courseNumber").value = this.props.course["course_number"];
            document.getElementById("term").value = this.props.course["term"];
            document.getElementById("year").value = this.props.course["year"];
            document.getElementById("active").checked = this.props.course["active"];
            document.getElementById("useFixedTeams").checked = this.props.course["use_fixed_teams"];
            document.getElementById("addCourseTitle").innerText = "Edit Course";
            document.getElementById("addCourseDescription").innerText = "Please edit this course";
            document.getElementById("createCourse").innerText = "Save";
            this.setState({editCourse: true});
        }
        document.getElementById("createCourse").addEventListener("click", () => {
            var success = true;
            var message = "Invalid Form: ";
            if(success && validator.isEmpty(document.getElementById("courseName").value)) {
                success = false;
                message += "Missing Course Name!";
            } else if (success && validator.isEmpty(document.getElementById("courseNumber").value)) {
                success = false;
                message += "Missing Course Number!";
            } else if (success && validator.isEmpty(document.getElementById("term").value)) {
                success = false;
                message += "Missing term!";
            } else if (success && !validator.isIn(document.getElementById("term").value, ["Fall", "Spring", "Summer"])) {
                success = false;
                message += "Invalid term!";
            } else if (success && validator.isEmpty(document.getElementById("year").value)) {
                success = false;
                message += "Missing year!";
            } else if (success && !validator.isLength(document.getElementById("year").value, {min: 4, max: 4})) {
                success = false;
                message += "Invalid year!";
            } else if (success && !validator.isNumeric(document.getElementById("year").value)) {
                success = false;
                message += "Invalid year!";
            } else if (success && (document.getElementById("year").value < 2000 || document.getElementById("year").value > 3000)) {
                success = false;
                message += "Year must be between 2000 and 3000!";
            }
            if(success) {
                var courseName = document.getElementById("courseName").value;
                var courseNumber = document.getElementById("courseNumber").value;
                var term = document.getElementById("term").value;
                var year = document.getElementById("year").value;
                var active = document.getElementById("active").checked;
                // var admin_id = this.props.user["user_id"];
                var cookies = new Cookies(); 
                var admin_id = cookies.get("user_id");
                var use_tas = this.props.addCourse ? document.getElementById("use_tas").checked : this.props.course["use_tas"];
                var useFixedTeams = document.getElementById("useFixedTeams").checked;
              
                let body = JSON.stringify({
                    "course_number": courseNumber,
                    "course_name": courseName,
                    "term": term,
                    "year": year,
                    "active": active,
                    "admin_id": admin_id,
                    "use_tas": use_tas,
                    "use_fixed_teams": useFixedTeams
                })
                if (this.props.addCourse)
                    genericResourcePOST("/course", this, body);
                else
                    genericResourcePUT(`/course?course_id=${this.props.course["course_id"]}`, this, body);
                   
            } else {
                document.getElementById("createCourse").classList.add("pe-none");
                document.getElementById("createCourseCancel").classList.add("pe-none");
                document.getElementById("createCourseClear").classList.add("pe-none");
                this.setState({validMessage: message});
                setTimeout(() => {
                    document.getElementById("createCourse").classList.remove("pe-none");
                    document.getElementById("createCourseCancel").classList.remove("pe-none");
                    document.getElementById("createCourseClear").classList.remove("pe-none");
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
                        add={this.props.addCourse}
                        resource={"Course"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={this.props.addCourse}
                        resource={"Course"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={this.props.addCourse}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="addCourseTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add Course</h1>
                    <div id="addCourseDescription" className="d-flex justify-content-around">Please add a new course</div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="firstNameLabel">Course Name</label></div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="courseName" name="newCourseName" className="m-1 fs-6" style={{}} placeholder="Course Name" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="courseCodeLabel">Course Number</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input type="text" id="courseNumber" name="newCourseNumber" className="m-1 fs-6" style={{}} placeholder="Course Number" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label htmlFor="exampleDataList" className="form-label">Term</label>
                            </div>
                        <div className="w-75 p-2 justify-content-around">
                            <input type="text" id="term" name="newTerm" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Spring" required/>
                            <datalist id="datalistOptions" style={{}}>
                                <option value="Fall"/>
                                <option value="Spring"/>
                                <option value="Summer"/>
                            </datalist>
                        </div>
                    </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="termLabel">Year</label>
                            </div>
                            <div className="w-75 p-2 justify-content-between">
                                <input type="text" id="year" name="newTerm" className="m-1 fs-6" style={{}} placeholder="e.g. 2024" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="activeLabel">Active</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input type="checkbox" id="active" name="newActive" className="m-1 fs-6" style={{}} required/>
                            </div>
                        </div>
                    </div>
                    { this.props.addCourse &&
                        <div className="d-flex flex-column">
                            <div className="d-flex flex-row justify-content-between">
                                <div className="w-25 p-2 justify-content-between">
                                    <label id="useTasLabel">Use TAs</label>
                                </div>
                                <div className="w-75 p-2 justify-content-around ">
                                    <input type="checkbox" id="use_tas" name="newUseTas" className="m-1 fs-6" style={{}} required/>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="fixedTeamsLabel">Fixed Teams</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <input type="checkbox" id="useFixedTeams" name="newFixedTeams" className="m-1 fs-6" style={{}} required/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddCourse;