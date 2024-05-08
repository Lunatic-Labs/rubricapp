import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import validator from "validator";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourcePOST, genericResourcePUT } from "../../../../utility.js";
import Cookies from "universal-cookie";
import { Box, Button, FormControl, Typography, TextField, FormControlLabel, Checkbox, FormGroup, } from "@mui/material";



class AdminAddCourse extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: "",
            editCourse: false,

            courseID: null,
            courseName: "",
            courseNumber: "",
            term: "",
            year: "",
            active: true,
            useTas: true,
            useFixedTeams: true,

            errors: {
                courseName: "",
                courseNumber: "",
                term: "",
                year: "",
            },
        };
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var course = state.course;
        var addCourse = state.addCourse;

        if (course !== null && !addCourse) {
            this.setState({
                courseID: course["course_id"],
                courseName: course["course_name"],
                courseNumber: course["course_number"],
                term: course["term"],
                year: course["year"],
                active: course["active"],
                useTas: course["use_tas"],
                useFixedTeams: course["use_fixed_teams"],
                editCourse: true,
            });
        }
    }

    handleChange = (e) => {
        const { id, value } = e.target;

        var formatString = "";

        for (let i = 0; i < id.length; i++) {
            if (i === 0) {
                formatString += id.charAt(0).toUpperCase();
            } else if (id.charAt(i) === id.charAt(i).toUpperCase()) {
                formatString += (" " + id.charAt(i).toLowerCase()); 
            } else {
                formatString += id.charAt(i);
            }
        }

        this.setState({
            [id]: value,

            errors: {
                ...this.state.errors,

                [id]:

                    value.trim() === ""
                        ? `${formatString} cannot be empty`
                        : "",
            },
        });
    };


    handleSelect = (event) => {
        this.setState({
            term: event.target.value,
        });
    };

    handleCheckboxChange = (e) => {
        const { id } = e.target;

        this.setState({
            [id]: e.target.checked,
        });
    };

    handleSubmit = () => {
        const {
            courseName,
            courseNumber,
            term,
            year,
            active,
            useTas,
            useFixedTeams,
        } = this.state;

        var navbar = this.props.navbar;

        var confirmCreateResource = navbar.confirmCreateResource;

        var isValidInput = true;

        // Your validation logic here
        if (
            courseName.trim() === "" ||
            courseNumber.trim() === "" ||
            year.trim() === "" ||
            term.trim() === ""
        ) {
            // Handle validation error
            this.setState({
                errors: {
                    courseName:
                        courseName.trim() === "" ? "Course name cannot be empty" : "",

                    courseNumber:
                        courseNumber.trim() === "" ? "Course number cannot be empty" : "",

                    year:
                        year.trim() === "" ? "Year cannot be empty" : "",

                    term: term.trim() === "" ? "Term cannot be empty" : "",
                },
            });

            isValidInput = false;
        } 
        
        if (year < 2023) {
            this.setState({
                errors: {
                    courseName:
                        courseName.trim() === "" ? "" : this.state.errors.courseName,

                    courseNumber:
                        courseName.trim() === "" ? "" : this.state.errors.courseNumber,

                    year: "Year should be at least 2023 or later",

                    term: term.trim() === "" ? "" : this.state.errors.term,
                },
            });

            isValidInput = false;
        } 
        
        if (typeof year == "string" && !validator.isNumeric(year)) {
            this.setState({
                errors: {
                    courseName:
                        courseName.trim() === "" ? "" : this.state.errors.courseName,

                    courseNumber:
                        courseName.trim() === "" ? "" : this.state.errors.courseNumber,

                    year: "Year must be a numeric value",

                    term: term.trim() === "" ? "" : this.state.errors.term,
                },
            });

            isValidInput = false;
        } 
        
        if (
            term.trim() !== "Spring" &&
            term.trim() !== "Fall" &&
            term.trim() !== "Summer"
        ) {
            this.setState({
                errors: {
                    courseName:
                        courseName.trim() === "" ? "" : this.state.errors.courseName,

                    courseNumber:
                        courseName.trim() === "" ? "" : this.state.errors.courseNumber,

                    year:
                        year === "" ? "" : this.state.errors.year,

                    term: "Term should be either Spring, Fall, or Summer",
                },
            });

            isValidInput = false;
        }

        console.log(this.state.errors);
        
        if (isValidInput) {
            var cookies = new Cookies();

            var body = JSON.stringify({
                "course_number": courseNumber,
                "course_name": courseName,
                "term": term,
                "year": year,
                "active": active,
                "admin_id": cookies.get("user")["user_id"],
                "use_tas": useTas,
                "use_fixed_teams": useFixedTeams
            })

            if (navbar.state.addCourse) {
                genericResourcePOST("/course", this, body);

            } else {
                genericResourcePUT(`/course?course_id=${navbar.state.course["course_id"]}`, this, body);
            }

            confirmCreateResource("Course");
        }
    };

    hasErrors = () => {
        const { errors } = this.state;

        return Object.values(errors).some((error) => !!error);
    };

    render() {
        const {
            errors,
            errorMessage,
            validMessage,
            courseName,
            courseNumber,
            term,
            year,
            active,
            useTas,
            useFixedTeams,
            editCourse,
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var addCourse = state.addCourse;

        return (
            <React.Fragment>
                {errorMessage && (
                    <ErrorMessage
                        add={addCourse}
                        resource={"Course"}
                        errorMessage={errorMessage}
                    />
                )}

                {validMessage !== "" && (
                    <ErrorMessage add={addCourse} error={validMessage} />
                )}

                <Box className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing" aria-label="addCourseForm">
                                <Typography id="addCourseTitle" variant="h5" aria-label="addCourseTitle">
                                    {editCourse ? "Edit Course" : "Add Course"}
                                </Typography>

                                <Box className="form-input">
                                    <TextField
                                        id="courseName"
                                        name="newCourseName"
                                        variant="outlined"
                                        label="Course Name"
                                        fullWidth
                                        value={courseName}
                                        error={!!errors.courseName}
                                        helperText={errors.courseName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 3 }}
                                        aria-label="courseNameInput"
                                    />

                                    <TextField
                                        id="courseNumber"
                                        name="newCourseNumber"
                                        variant="outlined"
                                        label="Course Number"
                                        fullWidth
                                        value={courseNumber}
                                        error={!!errors.courseNumber}
                                        helperText={errors.courseNumber}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 3 }}
                                        aria-label="courseNumberInput"
                                    />

                                    <TextField
                                        id="term"
                                        name="newTerm"
                                        variant="outlined"
                                        label="Term"
                                        fullWidth
                                        value={term}
                                        error={!!errors.term}
                                        helperText={errors.term}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 3 }}
                                        aria-label="courseTermInput"
                                    />
                    
                                    <TextField
                                        id="year" 
                                        name="newYear"
                                        variant="outlined"
                                        label="Year"
                                        fullWidth
                                        value={year}
                                        error={!!errors.year}
                                        helperText={errors.year}
                                        onChange={this.handleChange}
                                        required
                                        sx={{ mb: 3 }}
                                        aria-label="courseYearInput"
                                    />

                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(event) => {
                                                        this.setState({ active: event.target.checked });
                                                    }}

                                                    id="active"
                                                    value={active}
                                                    checked={active}
                                                    onClick={this.handleCheckboxChange}
                                                />
                                            }

                                            name="newActive"
                                            label="Active"
                                        />

                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(event) => {
                                                        this.setState({ useTas: event.target.checked });
                                                    }}

                                                    id="useTas"
                                                    value={useTas}
                                                    checked={useTas}
                                                    onClick={this.handleCheckboxChange}
                                                />
                                            }

                                            name="newUseTas"
                                            label="Use TA's"
                                        />
        
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    onChange={(event) => {
                                                        this.setState({ useFixedTeams: event.target.checked });
                                                    }}

                                                    id="useFixedTeams"
                                                    value={useFixedTeams}
                                                    checked={useFixedTeams}
                                                    onClick={this.handleCheckboxChange}
                                                />
                                            }

                                            name="newFixedTeams"
                                            label="Fixed Team"
                                        />
                                    </FormGroup>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            alignItems: "center",
                                            gap: "20px",
                                        }}
                                    >
                                        <Button
                                            onClick={() => {
                                                navbar.setState({
                                                    activeTab: "Courses",
                                                    course: null,
                                                    addCourse: null,
                                                });
                                            }}

                                            id=""
                                            className=""
                                            aria-label="cancelAddCourseButton"
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            onClick={this.handleSubmit}
                                            id="createCourse"
                                            className="primary-color"
                                            variant="contained"
                                            aria-label="addOrSaveAddCourseButton"
                                        >
                                            {editCourse ? "Save" : "Add Course"}
                                        </Button>
                                    </Box>
                                </Box>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>
            </React.Fragment>
        );
    }
}

export default AdminAddCourse;
