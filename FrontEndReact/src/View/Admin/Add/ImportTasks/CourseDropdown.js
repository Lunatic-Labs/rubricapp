import React, { Component } from 'react';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import 'bootstrap/dist/css/bootstrap.css';
import { genericResourceGET } from '../../../../utility.js';
import { Box } from '@mui/material';



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
    genericResourceGET(`/course`, 'courses', this);
  }

  render() {
    var courseChoices = [
      <MenuItem key={-1} value="">
        <em>None</em>
      </MenuItem>
    ];
    this.state.courses && this.state.courses.map((course, index) => {
      return(
        courseChoices = [...courseChoices,
          <MenuItem key={index} value={course["course_id"]} aria-label="adminImportAssessmentCourseChoice">
            {course["course_name"]}
          </MenuItem>
        ]
      )
    })
    if(this.state.courses) {
      return (
        <Box>
          <FormControl fullWidth>
            <InputLabel id="courseLabel">Select a Course</InputLabel>
            <Select
              required
              id='CourseDropdown'
              label='Select a Course'
              value={this.state.selectedCourse}
              onChange={this.handleCourseChange}
              aria-label="adminImportAssessmentCourseDropdown"
            >
              {courseChoices}
            </Select>
          </FormControl>
        </Box>
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
