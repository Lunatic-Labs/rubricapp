import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
import studentImage from '../AddUsers/Images/generic_bulk_upload_example.png';
import teamImage1 from '../AddUsers/Images/team_bulk_upload_example1.png';
import teamImage2 from '../AddUsers/Images/team_bulk_upload_example2.png';
import teamImage3 from '../AddUsers/Images/team_bulk_upload_example3.png';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourcePOST } from '../../../../utility.js';
import { Box, Typography,Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';



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
            <Box>
            
                    {this.state.errorMessage &&
                        <ErrorMessage
                            navbar={this.props.navbar}
                            errorMessage={this.state.errorMessage}
                        />
                    }

                    <Box  sx={{justifyContent:"center", }}className="card-spacing">
                        <Box className="form-position">
                            <Box className="card-style" sx={{ width: '67%'}}>
                                <Box className="form-spacing">
                                    <Typography variant="h5">
                                        {this.props.tab === "BulkUpload" ? "Student" : "Teams"} Bulk Upload
                                    </Typography>
                                    <div className="d-flex justify-content-center flex-column align-items-center">
                                            
                                    <Typography variant="h8" sx={{marginTop:"30px"}}>
                                        Upload a CSV or XLSX file to bulk upload
                                    </Typography> 

                                    <Typography variant="h8" sx={{marginTop:"20px", fontWeight: "bold"}}>
                                        CSV files obtained directly from an LMS will need to be adjusted into the format below
                                    </Typography> 
                                    <Box className="form-control" sx={{marginTop:"20px",marginBottom:"20px",borderRadius: "0"}}>
                                        <Typography variant="h8">
                                            "Last Name, First Name", Student Email, Role( 5 for Student or 4 for TA), Optional LMS ID
                                            <Tooltip title="Example of format in Excel: One TA, One Team, Three Students">

                                                <IconButton>
                                                    <HelpOutlineIcon />
                                                </IconButton>
                                                </Tooltip>
                                        </Typography>
                                    </Box>
                                            <form onSubmit={ this.onFormSubmit }
                                                
                                                className="d-flex justify-content-center align-items-center rounded p-1 bg-white gap-3">
                                                <input className='rounded form-control' type="file" name="file"
                                                    onChange={(e) => { this.setState({
                                                        selectedFile: e.target.files[0]
                                                    }) }}
                                                />

                                                <button className="btn btn-primary" type="submit"> Upload </button>
                                            </form>

                                        </div> 
                                </Box>
                            </Box>
                        </Box>
                    </Box>


            </Box>
        )
    }
}

export default AdminBulkUpload;
