import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import validator from 'validator';
import ErrorMessage from '../../../Error/ErrorMessage';
import { API_URL } from '../../../../App';
import { Box, Button, FormControl, Typography, TextField, FormControlLabel, Checkbox} from '@mui/material';

class AdminAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            validMessage: "",
            editCourse: false,
            courseName: '',
            courseNumber: '',
            term: '',
            year: '',
            active: false,
            useFixedTeams: false,
            errors: {
                courseName: '',
                courseNumber: '',
                term: '',
                year: '',
            }
        }
    }

    componentDidMount() {
        const { course, addCourse } = this.props;

        if (course !== null && !addCourse) {
            const { course_name, course_number, term, year, active, use_fixed_teams } = course;

            this.setState({
                courseName: course_name,
                courseNumber: course_number,
                term: term,
                year: year,
                active: active,
                useFixedTeams: use_fixed_teams,
                editCourse: true,
            });
        }
    }

    handleChange = (e) => {
        const { id, value } = e.target;
        this.setState({
          [id]: value,
          errors: {
            ...this.state.errors,
            [id]: value.trim() === '' ? `${id.charAt(0).toUpperCase() + id.slice(1)} cannot be empty` : '',
          },
        });
      };
    
    handleSubmit = () => {
    const { courseName, courseNumber, term, year } = this.state;

    // Your validation logic here
    if (courseName.trim() === '' || courseNumber.trim() === '' || year === '' || term.trim() === '') {
      // Handle validation error
      console.error('Validation error: Fields cannot be empty');
      this.setState({
        errors: {
          courseName: courseName.trim() === '' ? 'Course Name cannot be empty' : '',
          courseNumber: courseNumber.trim() === '' ? 'Course Number cannot be empty' : '',
          year: year === '' ? 'Year cannot be empty' : '',
          term: term.trim() === '' ? 'Term cannot be empty' : '',
        },
      });
    } 
    else if(year.length !== 4){
        this.setState({
            errors: {
                ...this.state.errors,
                year: 'Year should be four numeric digits',
            },
        });
    }
        else if (!validator.isNumeric(year)) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    year: 'Year must be a numeric value',
                },
            });
        } else if(term.trim() !== "Spring" && term.trim() !== "Fall" && term.trim() !== "Summer"){
        this.setState({
            errors: {
              term: term.trim() === '' ? 'Term should be either Spring, Fall, or Summer' : '',
            },
          });
    } else {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var user = state.user;
        var addCourse = state.addCourse;
        var course = state.course;
        var confirmCreateResource = navbar.confirmCreateResource;
        const courseName = document.getElementById("courseName").value;
        const courseNumber = document.getElementById("courseNumber").value;
        const term = document.getElementById("term").value;
        const year = document.getElementById("year").value;
        const active = document.getElementById("active").value === "on";
        const admin_id = user["user_id"];
        const use_tas = addCourse ? document.getElementById("use_tas").value === "on" : course["use_tas"];
        const useFixedTeams = document.getElementById("useFixedTeams").value === "on";
        fetch(
            (
                addCourse ?
                API_URL + "/course":
                API_URL + `/course/${course["course_id"]}`
            ),
            {
                method: addCourse ? "POST":"PUT",
                headers: {
                    "Content-Type": "application/json",
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
        confirmCreateResource("Course");
    } 
     
    }

    hasErrors = () => {
        const { errors } = this.state;
        return Object.values(errors).some((error) => !!error);
    };

    render() {
        const { courseName, courseNumber, term, year, errors, editCourse } = this.state;
        const {
            error,
            errorMessage,
            validMessage
        } = this.state;
        var navbar = this.props.navbar;
        var state = navbar.state;
        var addCourse = state.addCourse;
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={addCourse}
                        resource={"Course"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={addCourse}
                        resource={"Course"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={addCourse}
                        error={validMessage}
                    />
                }
                <Box className="page-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <Typography id="addCourseTitle" variant="h4"> {editCourse ? "Edit Course" : "Add Course"} </Typography>
                                <Box className="form-input">
                                    <TextField
                                        id="courseName" 
                                        name="newCourseName"                                    
                                        variant='outlined'
                                        label="Course Name"
                                        fullWidth
                                        value={courseName}
                                        error={!!errors.courseName}
                                        helperText={errors.courseName}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        id="courseNumber" 
                                        name="newCourseNumber"
                                        variant='outlined'
                                        label="Course Number"
                                        fullWidth
                                        value={courseNumber}
                                        error={!!errors.courseNumber}
                                        helperText={errors.courseNumber}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        id="term" 
                                        name="newTerm"
                                        variant='outlined'
                                        label="Term"
                                        fullWidth
                                        value={term}
                                        error={!!errors.term}
                                        helperText={errors.term}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <TextField
                                        id="year" 
                                        name="newTerm"
                                        variant='outlined'
                                        label="Year"
                                        fullWidth
                                        value={year}
                                        error={!!errors.year}
                                        helperText={errors.year}
                                        onChange={this.handleChange}
                                        required
                                        sx={{mb: 4}}
                                    />
                                    <FormControlLabel control={<Checkbox id="active" defaultChecked />} name="newActive" label="Active" />
                                    <FormControlLabel control={<Checkbox id="use_tas" defaultChecked />} name="newUseTas" label="Use Tas" />
                                    <FormControlLabel control={<Checkbox id="useFixedTeams" defaultChecked />} name="newFixedTeams" label="Fixed Team" />
                                    <Box sx={{display:"flex", justifyContent:"flex-end"}}>
                                    <Button onClick={this.handleButtonClick} id="createCourse" className="primary-color"
                                        variant="contained"
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
        )
    }
}


export default AdminAddCourse;