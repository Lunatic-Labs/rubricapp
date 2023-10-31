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
    this.handleCourseChange = (newSelectedCourse) => {
      this.props.setSelectedCourse(newSelectedCourse.target.value);
      this.setState({
        selectedCourse: newSelectedCourse.target.value
      });
    }
  }

  componentDidMount() {
    fetch(`http://127.0.0.1:5000/api/course`)
    .then(res => res.json())
    .then((result) => {
        if(result["success"]===false) {
            this.setState({
                isLoaded: true,
                errorMessage: result["message"]
            })
        } else {
            this.setState({
                isLoaded: true,
                courses: result['content']['courses'][0]
            })
    }},
    (error) => {
        this.setState({
            isLoaded: true,
            error: error
        });
    });
 }

  render() {
    var courseChoices = [
      <MenuItem key={-1} value="">
        <em>None</em>
      </MenuItem>
    ];
    {this.state.courses && this.state.courses.map((course, index) => {
      return(
        courseChoices = [...courseChoices,
          <MenuItem key={index} value={course["course_id"]}>
            {course["course_name"]}
          </MenuItem>
        ]
      )
    })}
    if(this.state.courses) {
      return (
          <FormControl
            variant="standard"
            sx={{
              m: 1,
              minWidth: 120
            }}
          >
            <InputLabel id="courseSelected-label">Select a Course</InputLabel>
            <Select
              id='CourseDropdown'
              value={this.state.selectedCourse}
              onChange={this.handleCourseChange}
            >
              {courseChoices}
            </Select>
          </FormControl>
        );
    } else {
      return(
        <>
          <div>
            <h1>Loading...</h1>
          </div>
        </>
      )
    }
  }
}

export default CourseDropdown;
