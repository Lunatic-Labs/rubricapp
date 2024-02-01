import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import studentImage from '../AddUsers/Images/generic_bulk_upload_example.png';
import teamImage1 from '../AddUsers/Images/team_bulk_upload_example1.png';
import teamImage2 from '../AddUsers/Images/team_bulk_upload_example2.png';
import teamImage3 from '../AddUsers/Images/team_bulk_upload_example3.png';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST } from '../../../../utility.js';
import { Button} from '@mui/material';


class AdminBulkUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null,
            selectedFile: null,
            isLoaded: false,

            // Used for displaying the appropriate image
            // when clicking the "next example" button.
            // It is being indexed by `currentTeamPic`.
            teamsPics: [
              teamImage1,
              teamImage2,
              teamImage3,
            ],

            // Used for the displayed example messages
            // on the team bulk upload page. `currentTeamPic`
            // is what is being used to get the correct message.
            teamsMsgs: [
              "One TA, one team, three students",
              "One TA, three teams, nine students",
              "Two TAs, two teams, six students",
            ],

            // Used for indexing `teamsPics` and `teamsMsgs`.
            currentTeamPic: 0,
        }

        this.changeTeamsExamplePic = this.changeTeamsExamplePic.bind(this);
    }

    // Changes the picture and message that is displayed
    // when clicking the `Next Example` button on the team
    // bulk upload button.
    changeTeamsExamplePic() {
      this.setState({
        currentTeamPic: (this.state.currentTeamPic+1) % this.state.teamsPics.length,
      });
    }

    onFormSubmit = (e) => {
        e.preventDefault();

        if(this.state.selectedFile === null) {
            this.setState({
                errorMessage: "Please Select a File to Upload!"
            });
        } else {
            var navbar = this.props.navbar;
            var formData = new FormData();

            formData.append('csv_file', this.state.selectedFile);

            let url = "/";

            if (this.props.tab === "BulkUpload") {
              url += "bulk_upload?course_id=";
            } else if (this.props.tab === "AdminTeamBulkUpload") {
              url += "team_bulk_upload?course_id=";
            }

            url += navbar.state.chosenCourse["course_id"];

            genericResourcePOST(url, this, formData);
        }
    }

    componentDidUpdate() {
        if(this.state.errorMessage !== null) {
            setTimeout(() => {
                this.setState({
                    errorMessage: null,
                    isLoaded: false
                });
            }, 2000);
        }

        if (this.state.errorMessage === null && this.state.isLoaded === true) {
            setTimeout(() => {
                this.props.navbar.setNewTab(this.props.tab === "BulkUpload" ? "Users" : "Teams");
            }, 1000);
        }
    }

    render() {
        return (
            <div className='container'>
                <div className='d-flex flex-column mt-5 pb-3 gap-3'
                    style={{ margin: 0, backgroundColor: "#abd1f9", borderRadius: "10px" }}
                >
                    {this.state.errorMessage &&
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
                                            <p className='p-2' style={{ margin: 0}}>"Last, First", StudentEmail, ROLE (5 for student, 4 for TA), Optional LMS ID</p>
                                        }

                                        {this.props.tab === "AdminTeamBulkUpload" &&
                                            <>
                                                <p className='p-2' style={{ margin: 0}}>TAEmail</p>
                                                <p className='p-2' style={{ margin: 0}}>"Team name"</p>
                                                <p className='p-2' style={{ margin: 0}}>"Last1, First1", Student Email 1, Optional LMS ID</p>
                                                <p className='p-2' style={{ margin: 0}}>"Last 2, First 2", Student Email 2, Optional LMS ID</p>
                                                <btn className='btn btn-primary' onClick={this.changeTeamsExamplePic}>Next Example</btn>
                                            </>
                                        }
                                    </div>
                                </div>

                                <p className='h6 fw-bold' id="Instructions"> Example of format in Excel: </p>
                                <p className='h6 fw-bold' id="ExamplePictureDiscription"> {this.state.teamsMsgs[this.state.currentTeamPic]} </p>

                                {this.props.tab === "AdminTeamBulkUpload" &&
                                    <div className='justify-content-center' style={{ width: "fit-content"}}>
                                        <img src={this.state.teamsPics[this.state.currentTeamPic]} alt=""></img>
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
            </div>
        )
    }
}

export default AdminBulkUpload;
