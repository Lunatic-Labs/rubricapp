import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import CourseDropdown from './CourseDropdown.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST } from '../../../../utility.js';
import { Box, Typography, Button, FormControl } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';



class AdminImportAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: "",
            courses: [],
            selectedCourse: '',

            errors: {
                courseToImportTasksFrom: ""
            }
        }

        this.setSelectedCourse = (newSelectedCourse) => {
            this.setState({
                selectedCourse: newSelectedCourse
            });
        };

        this.handleImportTasks = () => {
            var navbar = this.props.navbar;

            var chosenCourse = navbar.state.chosenCourse;

            var { selectedCourse } = this.state;

            if(selectedCourse === '') {
                this.setState({
                    errors: {
                        courseToImportTasksFrom: "Missing Course to Import Tasks From"
                    }
                });

                return;
            }

            genericResourcePOST(
                `/assessment_task_copy?source_course_id=${selectedCourse}&destination_course_id=${chosenCourse["course_id"]}`,
                this, {}
            );

            navbar.confirmCreateResource("AssessmentTask");
        }
    }

    render() {
        const {
            errorMessage,
            validMessage,
            errors
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var addAssessmentTask = state.addAssessmentTask;
        
        return (
            <>
                { errorMessage &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={addAssessmentTask}
                        error={validMessage}
                    />
                }
                <Box className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style">
                            <Box className='form-spacing'>
                                <Typography id="importAssessmentTasksTitle" sx={{mb: 3}} variant="h5" aria-label='adminImportAssessmentTasksTitle'> Import Assessment Tasks </Typography>

                                <Box className="form-input">
                                    <Box sx={{mb: 3}}>
                                        <Box>
                                            Please select the course you would like to import assesments tasks from.
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 3}}>
                                        <Box>
                                            <FormControl error={!!errors.courseToImportTasksFrom} required fullWidth sx={{mb: 3}} >
                                                <CourseDropdown
                                                    id="courseSelected"
                                                    setSelectedCourse={this.setSelectedCourse}
                                                    aria-label="adminImportAssessmentCourseSelect"
                                                />

                                                <FormHelperText>{errors.courseToImportTasksFrom}</FormHelperText>
                                            </FormControl>
                                        </Box>
                                    </Box>

                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                        <Button 
                                            id=""
                                            className=""

                                            onClick={() => {
                                                navbar.confirmCreateResource("AssessmentTask");
                                            }}

                                            aria-label="adminImportAssessmentTaskCancelButton"
                                        >
                                            Cancel
                                        </Button>

                                        <Button
                                            id="importAssessmentTasks"
                                            className="primary-color"
                                            variant="contained"

                                            onClick={() => {
                                                this.handleImportTasks();
                                            }}

                                            aria-label="adminImportAssessmentTasksSubmitButton"
                                        >
                                            Import Tasks
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </>
        )
    }
}

export default AdminImportAssessmentTask;