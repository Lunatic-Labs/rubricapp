import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import CourseDropdown from './CourseDropdown';
import validator from "validator";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST } from '../../../../utility';

class AdminImportAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
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
        document.getElementById("importAssessmentTasks").addEventListener("click", () => {
            var success = true;
            var message = "Invalid Form: ";
            if(success && !validator.isNumeric(String(this.state.selectedCourse)) && validator.equals(this.state.selectedCourse, '')) {
                success = false;
                message += "Missing Course!";
            }
            if(success) {
                genericResourcePOST(
                    `/assessment_task_copy?source_course_id=${this.state.selectedCourse}&destination_course_id=${this.props.chosenCourse["course_id"]}`,
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
                        this.setState({error: null, errorMessage: null, validMessage: ""});
                    }, 1000);
                }
            }, 1000);
        });
    }
    render() {
        const {
            error,
            errorMessage,
            validMessage
        } = this.state;
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        resource={"Assessment Task"}
                        errorMessage={errorMessage}
                    />
                }
                { validMessage!=="" &&
                    <ErrorMessage
                        add={this.props.addAssessmentTask}
                        error={validMessage}
                    />
                }
                <div id="outside">
                    <h1 id="importAssessmentTasksTitle" className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Import Assessment Tasks</h1>
                    <div className="d-flex justify-content-around">
                        Please select the course you would like to import assesments tasks from
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="dueDateLabel">Course</label>
                            </div>
                            <div className="d-flex flex-row justify-content-around">
                                <CourseDropdown
                                    id="courseSelected"
                                    setSelectedCourse={this.setSelectedCourse}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminImportAssessmentTask;