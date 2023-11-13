import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import BackButton from '../../../Components/BackButton';
import { Box, Container, Button, FormControl, Typography, TextField, FormControlLabel, Checkbox } from '@mui/material';

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
            var message = "Invalid Form: ";
            if(validator.isEmpty(document.getElementById("courseName").value)) {
                message += "Missing Course Name!";
            } else if (validator.isEmpty(document.getElementById("courseNumber").value)) {
                message += "Missing Course Number!";
            } else if (validator.isEmpty(document.getElementById("term").value)) {
                message += "Missing term!";
            } else if (!validator.isIn(document.getElementById("term").value, ["Fall", "Spring", "Summer"])) {
                message += "Invalid term!";
            } else if (validator.isEmpty(document.getElementById("year").value)) {
                message += "Missing year!";
            } else if (!validator.isLength(document.getElementById("year").value, {min: 4, max: 4})) {
                message += "Invalid year!";
            } else if (!validator.isNumeric(document.getElementById("year").value)) {
                message += "Invalid year!";
            } else if (document.getElementById("year").value < 2000 || document.getElementById("year").value > 3000) {
                message += "Year must be between 2000 and 3000!";
            }
            if(message==="Invalid Form: ") {
                var courseName = document.getElementById("courseName").value;
                var courseNumber = document.getElementById("courseNumber").value;
                var term = document.getElementById("term").value;
                var year = document.getElementById("year").value;
                var active = document.getElementById("active").checked;
                var admin_id = this.props.user["user_id"];
                var use_tas = this.props.addCourse ? document.getElementById("use_tas").checked : this.props.course["use_tas"];
                var useFixedTeams = document.getElementById("useFixedTeams").checked;
                fetch(
                    (
                        this.props.addCourse ?
                        API_URL + "/course":
                        API_URL + `/course/${this.props.course["course_id"]}`
                    ),
                    {
                        method: this.props.addCourse ? "POST":"PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            "course_number": courseNumber,
                            "course_name": courseName,
                            "term": term,
                            "year": year,
                            "active": active,
                            "admin_id": admin_id,
                            "use_tas": use_tas,
                            "use_fixed_teams": useFixedTeams
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
                <Box className="page-spacing">
                    <BackButton />
                    <Box sx={{
                        display:"flex",
                        justifyContent:"center",
                         alignItems:"center",
                    }}>
                         <Box sx={{
                            display:"flex",
                            width: "30%",
                            padding:"var(--3, 24px)",
                            borderRadius: "10px",
                            borderTop: "3px solid #4A89E8",
                            background: "#FFF",
                        }}
                       
                        >
                            <FormControl sx={{width:"100%", gap:"24px"}}>
                                <Typography variant='h4'> Add course </Typography>
                                <Box sx={{display:"flex", flexDirection:"column", width:"100%", mt:"10px"}}>
                                    <TextField
                                        id="courseName" 
                                        name="newCourseName"                                    
                                        variant='outlined'
                                        label="Course Name"
                                        fullWidth
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        id="courseNumber" 
                                        name="newCourseNumber"
                                        variant='outlined'
                                        label="Course Name"
                                        fullWidth
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label="Course Name"
                                        fullWidth
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label="Course Name"
                                        fullWidth
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <FormControlLabel control={<Checkbox defaultChecked />} id="active" name="newActive" label="Active" />
                                    <FormControlLabel control={<Checkbox defaultChecked />} id="use_tas" name="newUseTas" label="Use TAs" />
                                    <FormControlLabel control={<Checkbox defaultChecked />} id="useFixedTeams" name="newFixedTeams" label="Fixed Team" />
                                    <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                                    <Button className='primary-color'
                                        variant='contained' 
                                        onClick={() => {
                                            this.props.confirmCreateResource("Course");
                                        }}
                                    >   
                                        Add Course
                                    </Button>
                                    </Box>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                   
                   
                </Box>
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
                    <button onClick={() => {
                                            this.props.confirmCreateResource("Course");
                                        }}>
                        check
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddCourse;