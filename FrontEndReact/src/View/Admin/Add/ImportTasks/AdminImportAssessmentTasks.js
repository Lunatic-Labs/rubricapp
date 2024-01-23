import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import CourseDropdown from './CourseDropdown.js';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST } from '../../../../utility.js';
import { Box, Typography, Button } from '@mui/material';

class AdminImportAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            validMessage: "",
            courses: [],
            selectedCourse: ''
        }

        this.setSelectedCourse = (newSelectedCourse) => {
            this.setState({
                selectedCourse: newSelectedCourse
            });
        };
    }

    componentDidMount() {
        var navbar = this.props.navbar;
        var state = navbar.state;
        var chosenCourse = state.chosenCourse;

        document.getElementById("importAssessmentTasks").addEventListener("click", () => {
            var success = true;
            var message = "Invalid Form: ";
            var selectedCourse = this.state.selectedCourse;

            if(success && typeof(selectedCourse)==="string" && !validator.isNumeric(selectedCourse) && validator.equals(selectedCourse, '')) {
                success = false;
                message += "Missing Course!";
            }

            if(success) {
                genericResourcePOST(
                    `/assessment_task_copy?source_course_id=${selectedCourse}&destination_course_id=${chosenCourse["course_id"]}`,
                    this, {}
                );
            } else {
                document.getElementById("importAssessmentTasks").classList.add("pe-none");
                document.getElementById("importAssessmentTasksCancel").classList.add("pe-none");

                this.setState({validMessage: message});

                setTimeout(() => {
                    document.getElementById("importAssessmentTasks").classList.remove("pe-none");
                    document.getElementById("importAssessmentTasksCancel").classList.remove("pe-none");
                    this.setState({validMessage: ""});
                }, 2000);
            }

            setTimeout(() => {
                if(document.getElementsByClassName("alert-danger")[0]!==undefined) {
                    setTimeout(() => {
                        this.setState({errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }

    render() {
        const {
            errorMessage,
            validMessage
        } = this.state;

        var navbar = this.props.navbar;
        var state = navbar.state;
        var addAssessmentTask = state.addAssessmentTask;
        var confirmCreateResource = navbar.confirmCreateResource;
        
        return (
            <React.Fragment>
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
                            <Typography id="importAssessmentTasksTitle" sx={{mb: 3}} variant="h5"> Import Assessment Tasks </Typography>
                                <Box className="form-input">
                                    <Box sx={{mb: 3}}>
                                <Box>
                                    Please select the course you would like to import assesments tasks from.
                                </Box>
                    </Box>
                    <Box sx={{ mb: 3}}>
                            <Box>
                                <CourseDropdown
                                    id="courseSelected"
                                    setSelectedCourse={this.setSelectedCourse}
                                />
                            </Box>
                       
                    </Box>
                            <Box sx={{display:"flex", justifyContent:"flex-end", alignItems:"center", gap: "20px"}}>
                                <Button 
                                onClick={() => {
                                    confirmCreateResource("AssessmentTask")
                                }}
                                id="" className="">   
                                    Cancel
                                </Button>

                                <Button 
                                onClick={() => {
                                    confirmCreateResource('AssessmentTask');
                                }}
                                id="importAssessmentTasks" className="primary-color"
                                variant="contained"
                                >   
                                    Import Tasks
                                </Button>
                                </Box>
                            </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </React.Fragment>
        )
    }
}

export default AdminImportAssessmentTask;