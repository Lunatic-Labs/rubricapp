import React, { Component } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import 'bootstrap/dist/css/bootstrap.css';

class CourseDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'option1',
      selectedCourse: '',
      courses: []
    };
  }
  componentDidMount() {
    fetch(`http://127.0.0.1:5000/api/course`)
    .then(res => res.json())
    .then((result) => {
        console.log(result)
        if(result["success"]===false) {
            this.setState({
                isLoaded: true,
                errorMessage: result["message"]
            })
        } else {
            this.setState({
                isLoaded: true,
                courses: result['content']['courses']
            })
            console.log(this.state.courses)
    }},
    (error) => {
        this.setState({
            isLoaded: true,
            error: error
        });
    });
 }

  render() {
    console.log(this.state.courses)
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="courseSelected-label">Select a Course</InputLabel>
          <Select
            labelId="courseSelected-label"
            // id="courseSelected"
            // value={this.props.selectedCourse}
            // onChange={this.handleCourseChange}
            label="Select a Course"
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.state.courses.map((course) => (
              <MenuItem key={course.course_id} value={course.course_id}>
                {course.course_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
  }
}

export default CourseDropdown;
