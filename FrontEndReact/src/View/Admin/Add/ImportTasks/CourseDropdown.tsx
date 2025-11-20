// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/InputLabel' or i... Remove this comment to see the full error message
import InputLabel from '@mui/material/InputLabel';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/FormControl' or ... Remove this comment to see the full error message
import FormControl from '@mui/material/FormControl';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/Select' or its c... Remove this comment to see the full error message
import Select from '@mui/material/Select';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/MenuItem' or its... Remove this comment to see the full error message
import MenuItem from '@mui/material/MenuItem';
import 'bootstrap/dist/css/bootstrap.css';
import { genericResourceGET } from '../../../../utility.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading.js';



class CourseDropdown extends Component {
  handleCourseChange: any;
  props: any;
  setState: any;
  state: any;
  constructor(props: any) {
    super(props);

    this.state = {
      selectedOption: 'option1',
      selectedCourse: '',
      courses: []
    };

    this.handleCourseChange = (newSelectedCourse: any) => {
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
      // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
      <MenuItem key={-1} value="">
        // @ts-expect-error TS(7026): JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <em>None</em>
      </MenuItem>
    ];
    this.state.courses && this.state.courses.map((course: any, index: any) => {
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
        <Loading />
      )
    }
  }
}

export default CourseDropdown;
