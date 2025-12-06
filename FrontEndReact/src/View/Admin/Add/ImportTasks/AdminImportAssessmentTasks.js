import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import CourseDropdown from './CourseDropdown.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST } from '../../../../utility.js';
import { Box, Typography, Button, FormControl } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

/**
 * Creates an instance of the AdminImportAssessmentTask component.
 * Allows administrators to import assessment tasks from another course.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * @property {string|null} state.errorMessage - The error message to display if an error occurs during the import process.
 * @property {string} state.validMessage - The validation message to display for successful operations.
 * @property {Array} state.courses - The list of available courses to import tasks from.
 * @property {string} state.selectedCourse - The ID of the course selected for importing tasks.
 * @property {Object} state.errors - Contains validation error messages for the form fields.
 * @property {string} state.errors.courseToImportTasksFrom - Validation error message for the course selection.
 * 
 * Components:
 * CourseDropdown.js
 * 
 * Data:
 * Coursedropdown handles fetching available courses.
 * the component receives the selected course ID via setSelectedCourse.
 * on submission, it sends a POST request to import tasks from the selected course.
 * 
 * TODO:
 */

class AdminImportAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            validMessage: "",
            courses: [], // NOTE: Initialized, but never populated in this component
            selectedCourse: '',

            errors: {
                courseToImportTasksFrom: ""
            }
        }
        /**
         * 
         * @method setSelectedCourse - Sets the selected course ID in the component state.
         * @param {string} newSelectedCourse - The ID of the course selected for importing tasks.
         * 
         * Called by the CourseDropdown component when a course is selected.
         */

        this.setSelectedCourse = (newSelectedCourse) => {
            this.setState({
                selectedCourse: newSelectedCourse
            });
        };
        /**
         * @method handleImportTasks - Handles the import of assessment tasks from the selected course.
         * 
         * API Endpoint: /assessment_task_copy
         * HTTP Method: POST
         * 
         * Parameters:
         * @param {string} source_course_id - The ID of the course to import tasks from (selectedCourse).
         * @param {string} destination_course_id - The ID of the current course to import tasks into (chosenCourse).
         * 
         * Data Operations:
         * - Sends a POST request to import assessment tasks from the selected course to the current course.
         * 
         * Flow:
         * 1. Validates that a course has been selected.
         * 2. Sends POST request with source and destination course IDs.
         * 3. On success, calls navbar.confirmCreateResource to confirm task creation.
         * 
         * Potential Issues:
         * No handling of duplicate tasks or conflicts during import.
         * No loading state or user feedback during the import process.
         * state.courses is initialized but never populated or used.
         * state.validMessage is defined but not set during successful operations.
         * no preview of tasks to be imported before submission.
         * 
         */

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
                `/assessment_task_copy?source_course_id=${selectedCourse}&destination_course_id=${chosenCourse["course_id"]}`,this, {}).then((result) => {
                if (result !== undefined && result.errorMessage === null) {
                    navbar.confirmCreateResource("AssessmentTask");
                }
            });
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
                                            Please select the course you would like to import assessments tasks from.
                                        </Box>
                                    </Box>

                                    <Box sx={{ mb: 3}}>
                                        <Box>
                                            {/**
                                             * CourseDropdown Component - Dropdown to select the course to import tasks from.
                                             * - fetches available courses and allows selection.
                                             * - calls setSelectedCourse on selection.
                                             */}
                                            <FormControl error={!!errors.courseToImportTasksFrom} required fullWidth sx={{mb: 3}} aria-label="adminImportAssessmentCourseSelect" >
                                                <CourseDropdown
                                                    id="courseSelected"
                                                    setSelectedCourse={this.setSelectedCourse}
                                                />

                                                <FormHelperText>{errors.courseToImportTasksFrom}</FormHelperText>
                                            </FormControl>
                                        </Box>
                                    </Box>

                                    <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                        {/**
                                         * @button Cancel - Button to cancel the import operation.
                                         * calls navbar.confirmCreateResource to return to the assessment task view.
                                         */}
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
                                            {/**
                                             * @button Import Tasks - Button to submit the import operation.
                                             * calls handleImportTasks to perform the import.
                                             */}
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