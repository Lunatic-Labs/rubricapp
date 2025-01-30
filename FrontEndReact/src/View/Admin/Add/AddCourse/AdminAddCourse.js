import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "../../../../SBStyles.css";
import validator from "validator";
import ErrorMessage from "../../../Error/ErrorMessage.js";
import { genericResourcePOST, genericResourcePUT } from "../../../../utility.js";
import Cookies from "universal-cookie";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box, Button, FormControl, Typography, Popover, TextField, Tooltip, IconButton, FormControlLabel, Checkbox, FormGroup, } from "@mui/material";



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
            anchorEl: null,

            errors: {
                courseName: "",
                courseNumber: "",
                term: "",
                year: "",
            },
        };
        
    }

    setAnchorEl = (element) => {
        this.setState({ anchorEl: element });
    };

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
    handleClick = (event) => {
        this.setAnchorEl(event.currentTarget);
      };
    
    handleClose = () => {
        this.setAnchorEl(null);
      };

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
            year: yearState,
            active,
            useTas,
            useFixedTeams,
        } = this.state;

        var year = yearState.toString().trim();

        var navbar = this.props.navbar;

        var confirmCreateResource = navbar.confirmCreateResource;

        var newErrors = {
            "courseName": "",
            "courseNumber": "",
            "year": "",
            "term": ""
        };

        if (courseName.trim() === "")
            newErrors["courseName"] = "Course Name cannot be empty";

        if (courseNumber.trim() === "")
            newErrors["courseNumber"] = "Course Number cannot be empty";

        if (year.trim() === "")
            newErrors["year"] = "Year cannot be empty";

        else if (parseInt(year) < 2023)
            newErrors["year"] = "Year should be at least 2023 or later";

        else if (typeof(year) === "string" && !validator.isNumeric(year))
            newErrors["year"] = "Year must be a numeric value";

        if (term.trim() === "")
            newErrors["term"] = "Term cannot be empty";

        if (newErrors["courseName"] !== "" || newErrors["courseNumber"] !== "" ||newErrors["year"] !== "" ||newErrors["term"] !== "") {
            this.setState({
                errors: newErrors
            });

            return;
        }

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

        let promise;

        if (navbar.state.addCourse) {
            promise = genericResourcePOST("/course", this, body);

        } else {
            promise = genericResourcePUT(`/course?course_id=${navbar.state.course["course_id"]}`, this, body);
        }

        promise.then(result => {
            if (result !== undefined && result.errorMessage === null) {
                confirmCreateResource("Course");
			}
		});
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
        const open = Boolean(this.state.anchorEl);
        const id = open ? 'simple-popover' : undefined;

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
                                        label="Type your Term name here"
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
                                            label="Fixed Teams"
                                            />
                                            <div style={{padding: '3px'}}>
                                            <Tooltip title="Help">
                                                <IconButton aria-label="help" onClick={this.handleClick}>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            </div>
                                            <Popover
                                                id={id}
                                                open={open}
                                                anchorEl={this.state.anchorEl}
                                                onClose={this.handleClose}
                                                anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                                }}
                                            >
                                                <Typography sx={{ p: 2 }}>Active:  Uncheck this box at the end of the term to move it to the Inactive Courses table.<br>
                                                </br>Use TA's:  
                                                Will you use Teaching or Learning Assistants in this course to fill out rubrics?<br>
                                                </br>Fixed teams:  Do you assign students to teams or do they form teams on their own?</Typography>
                                            </Popover>
                                            
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
