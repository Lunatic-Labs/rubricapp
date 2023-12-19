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

            courseID: null,
            courseName: '',
            courseNumber: '',
            term: '',
            year: '',
            active: true,
            use_tas: true,
            use_fixed_teams: true,

            errors: {
                courseName: '',
                courseNumber: '',
                term: '',
                year: '',
            }
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var course = state.course;
        var addCourse = state.addCourse;

        if (course !== null && !addCourse) {
            const {
                course_id,
                course_name,
                course_number,
                term,
                year,
                active,
                use_tas,
                use_fixed_teams
            } = course;

            this.setState({
                courseID: course_id,
                courseName: course_name,
                courseNumber: course_number,
                term: term,
                year: year,
                active: active,
                use_tas: use_tas,
                use_fixed_teams: use_fixed_teams,
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
        const {
            courseID,
            courseName,
            courseNumber,
            term,
            year,
            active,
            use_tas,
            use_fixed_teams
        } = this.state;
        var navbar = this.props.navbar;
        var state = navbar.state;
        var admin_id = state.user_id;
        var confirmCreateResource = navbar.confirmCreateResource;

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
        } else if(year < 2023){
            this.setState({
                errors: {
                    ...this.state.errors,
                    year: 'Year should be at least 2023 or later',
                },
            });
        } else if (typeof(year)=="string" && !validator.isNumeric(year)) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    year: 'Year must be a numeric value',
                },
            });
        } else if(term.trim() !== "Spring" && term.trim() !== "Fall" && term.trim() !== "Summer"){
            this.setState({
                errors: {
                    ...this.state.errors,
                    term: 'Term should be either Spring, Fall, or Summer',
                },
            });
        } else {
            var url = API_URL;
            var method;
            if(courseID) {
                url += `/course/${courseID}`;
                method = "PUT";
            } else {
                url += "/course";
                method = "POST";
            }
            fetch(
                ( url ),
                {
                    method: method,
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
                        "use_fixed_teams": use_fixed_teams
                    })
                }
            )
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
        const {
            error,
            errors,
            errorMessage,
            validMessage,
            courseName,
            courseNumber,
            term,
            year,
            active,
            use_tas,
            use_fixed_teams,
            editCourse
        } = this.state;
        var navbar = this.props.navbar;
        var state = navbar.state;
        var addCourse = state.addCourse;
        var confirmCreateResource = navbar.confirmCreateResource;
        
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
                <Box className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <FormControl className="form-spacing">
                                <Typography id="addCourseTitle" variant="h5"> {editCourse ? "Edit Course" : "Add Course"} </Typography>
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
                                        sx={{mb: 3}}
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
                                        sx={{mb: 3}}
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
                                        sx={{mb: 3}}
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="active"
                                                checked={active}
                                            />
                                        }
                                        name="newActive"
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="use_tas"
                                                checked={use_tas}
                                            />
                                        }
                                        name="newUseTas"
                                        label="Use Tas"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                id="useFixedTeams"
                                                checked={use_fixed_teams}
                                            />
                                        }
                                        name="newFixedTeams"
                                        label="Fixed Team"
                                    />
                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                    <Button onClick={() => {
                                        confirmCreateResource("Course")
                                    }}
                                     id="" className="">   
                                        Cancel
                                    </Button>

                                    <Button onClick={this.handleSubmit} id="createCourse" className="primary-color"
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