import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import studentImage from '../AddUsers/Images/student.jpg';
import teamImage from '../AddUsers/Images/team.jpg';
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';


class AdminBulkUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            selectedFile: null
        }
    }

    onFormSubmit = (e) => {
        e.preventDefault();

        if(this.state.selectedFile === null) {
            this.setState({
                error: true,
                errorMessage: "Please Select a File to Upload!"
            });
        } else {
            var navbar = this.props.navbar;
            var setNewTab = navbar.setNewTab;
            var formData = new FormData();

            formData.append('csv_file', this.state.selectedFile);

            var url = API_URL + `/${
                this.props.tab === "BulkUpload" ? "student" : "team"
            }_bulk_upload?course_id=${
                navbar.state.chosenCourse["course_id"]
            }`;
            
            fetch(url, { method: "POST", body: formData})
            .then(response => response.json())
            .then(data => {
                if (data.success === false) {
                    this.setState({
                        error: true,
                        errorMessage: data.message
                    });
                } else {
                    setTimeout(() => {
                        setNewTab(this.props.tab === "BulkUpload" ? "Users" : "Teams");
                    }, 1000);
                }
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: error.toString()
                });
            });
        }
    }

    render() {
        return (
            <>
                <div className='d-flex flex-column mt-5 pb-3 gap-3'
                    style={{ margin: 0, backgroundColor: "#abd1f9", borderRadius: "10px" }}
                >
                    {this.state.error &&
                        <ErrorMessage
                            navbar={this.props.navbar}
                            errorMessage={this.state.errorMessage}
                        />
                    }

                    <h1 className={`text-center pb-3 ${this.state.errorMessage ? "" : "pt-5"}`}>
                        {this.props.tab === "BulkUpload" ? "Student" : "Teams"} Bulk Upload
                    </h1>

                    <div className="d-flex flex-row justify-content-center">
                        <div style={{ borderRadius: "10px" }}
                            className={`d-flex flex-column bg-white gap-4 ${this.state.errorMessage ? "" : "pt-4"} pb-5`}
                        >
                            <div className="fw-bold" style={{ width: "50vw" }}>
                                <h2>Instructions</h2>

                                <p className='h6 fw-bold' style={{ padding: 0, margin: 0}}>
                                    Upload a CSV or XLSX file to bulk upload.
                                </p>

                                <p className='h6 fw-bold' style={{ padding: 0, margin: 0}}>
                                    CSV files obtained directly from an LMS will need to be edited to fit the bulk upload format:
                                </p>
                            </div>

                            <div style={{ height: "fit-content"}}
                                className="d-flex flex-column justify-content-center align-items-center gap-3"
                            >
                                <div className='d-flex justify-content-center align text-center'
                                    style={{ width: "fit-content", borderRadius: "10px", backgroundColor: "#E0E0E0"}}
                                >
                                    <div className='d-flex flex-column rounded'>
                                        {this.props.tab === "BulkUpload" &&
                                            <p className='p-2' style={{ margin: 0}}>Last, First, Student Email, (Optional LMS ID)</p>
                                        }

                                        {this.props.tab === "AdminTeamBulkUpload" &&
                                            <>
                                                <p className='p-2' style={{ margin: 0}}>Team name, TA Email</p>
                                                <p className='p-2' style={{ margin: 0}}>Last, First, Student Email, (Optional LMS ID)</p>
                                            </>
                                        }
                                    </div>
                                </div>

                                <p className='h6 fw-bold' id="Instructions"> Example of format in Excel: </p>

                                {this.props.tab === "AdminTeamBulkUpload" &&
                                    <div className='justify-content-center'>
                                        <img src={teamImage} alt=""></img>
                                    </div>
                                }

                                {this.props.tab === "BulkUpload" &&
                                    <div className='justify-content-center'>
                                        <img src={studentImage} alt=""></img>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center flex-column align-items-center">
                        <form onSubmit={ this.onFormSubmit }
                            className="d-flex justify-content-center align-items-center rounded p-1 bg-white gap-3"
                        >
                            <input className='rounded form-control' type="file" name="file"
                                onChange={(e) => { this.setState({
                                    selectedFile: e.target.files[0]
                                }) }}
                            />

                            <button className="btn btn-primary" type="submit"> Upload </button>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}

export default AdminBulkUpload;