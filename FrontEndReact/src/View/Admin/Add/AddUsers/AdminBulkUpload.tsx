import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../../../../SBStyles.css';
// @ts-ignore
import studentImage from '../AddUsers/Images/generic_bulk_upload_example.png';
// @ts-ignore
import teamImage1 from '../AddUsers/Images/team_bulk_upload_example1.png';
// @ts-ignore
import teamImage2 from '../AddUsers/Images/team_bulk_upload_example2.png';
// @ts-ignore
import teamImage3 from '../AddUsers/Images/team_bulk_upload_example3.png';
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourcePOST } from '../../../../utility';
import { Box, Typography, Tooltip, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { RequestState, REQUEST_STATE } from '../../../../Enums/RequestState';
import DynamicLoadingSpinner from '../../../Loading/DynamicLoading';
import debounce from 'debounce';

interface AdminBulkUploadState {
    errorMessage: string | null;
    selectedFile: any;
    isLoaded: boolean;
    teamsPics: string[];
    teamsMsgs: string[];
    currentTeamPic: number;
    uploadRequestStatus: RequestState;
}

class AdminBulkUpload extends Component<any, AdminBulkUploadState> {
    debouncedSubmit: any;
    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            selectedFile: null,
            isLoaded: false,
            uploadRequestStatus: REQUEST_STATE.IDLE,

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
              "One TA, One Team, Three Students",
              "One TA, Three Teams, Nine Students",
              "Two TAs, Two Teams, Six Students",
            ],

            // Used for indexing `teamsPics` and `teamsMsgs`.
            currentTeamPic: 0,
        }

        this.debouncedSubmit = debounce(this.blockMultipleRequests.bind(this), 1000);
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

    /**
     * This function makes sure one request is sent and we have awaited for a failure or success.
     * @param {*} e 
     */
    blockMultipleRequests = (e:any) => {
        if (this.state.uploadRequestStatus !== REQUEST_STATE.LOADING){
            this.onFormSubmit(e);
        }
    }

    onFormSubmit = (e: any) => {
        e.preventDefault();

        this.setState({
            uploadRequestStatus: REQUEST_STATE.LOADING,
        });

        var fileName;
        var lastDot;
        var fileExtension;

        if (this.state.selectedFile !== null) {
            fileName = this.state.selectedFile.name;
            lastDot = fileName.lastIndexOf('.');
            fileExtension = fileName.substring(lastDot + 1);
        }

        if(this.state.selectedFile === null) {
            this.setState({
                errorMessage: "Please Select a File to Upload!",
                uploadRequestStatus: REQUEST_STATE.IDLE,
            });
        } else if (fileExtension !== "csv" && fileExtension !== "xlsx") {
            this.setState({
                errorMessage: "Please Select a File using the .csv or .xlsx format!",
                uploadRequestStatus: REQUEST_STATE.IDLE,
            });
        } else {
            var navbar = this.props.navbar;

            var formData = new FormData();

            var confirmCreateResource = navbar.confirmCreateResource;

            formData.append('csv_file', this.state.selectedFile);

            let url = "/";

            if (this.props.tab === "BulkUpload") {
              url += "bulk_upload?course_id=";

            } else if (this.props.tab === "AdminTeamBulkUpload") {
              url += "team_bulk_upload?course_id=";
            }

            url += navbar.state.chosenCourse["course_id"];

            genericResourcePOST(url, this, formData as any).then((result) => {
                if (result !== undefined && result.errorMessage === null) {
                    if (this.props.tab === "BulkUpload") {
                        confirmCreateResource("UserBulkUpload");
                    } else {
                        confirmCreateResource("TeamBulkUpload");
                    }
                    this.setState({
                        uploadRequestStatus: REQUEST_STATE.SUCCESS,
                    });
                } else {
                    this.setState({
                        uploadRequestStatus: REQUEST_STATE.ERROR,
                    });
                }
            }).catch((error) => { 
                this.setState({
                    errorMessage: error,
                    uploadRequestStatus: REQUEST_STATE.ERROR,
                })
                
            });
        }
    }

    componentDidUpdate() {
        if(this.state.errorMessage !== null) {
            setTimeout(() => {
                this.setState({
                    errorMessage: null,
                    isLoaded: false
                });
            }, 5000);
        }
    }

    render() {
        var navbar = this.props.navbar;
        var confirmCreateResource = navbar.confirmCreateResource;

        const {uploadRequestStatus} = this.state; 
        const isLoading: boolean = uploadRequestStatus === REQUEST_STATE.LOADING;

        console.log(this.state.errorMessage);

        return (
            <Box>
                {this.state.errorMessage &&
                    <ErrorMessage
                        errorMessage={String(this.state.errorMessage)}
                        aria-label="adminBulkUploadErrorMessage"
                    />
                }

                <Box  sx={{ justifyContent:"center" }} className="card-spacing">
                    <Box className="form-position">
                        <Box className="card-style" sx={{ width: '80%' }}>
                            <Box className="form-spacing">
                                <Typography variant="h5" aria-label='adminBulkUploadTitle'>
                                    {this.props.tab === "BulkUpload" ? "Student" : "Teams"} Bulk Upload
                                </Typography>
                                <div className="d-flex justify-content-center flex-column align-items-center">
                                    <Typography variant="body1" sx={{ marginTop:"30px" }}>
                                        Upload a CSV or XLSX file to bulk upload
                                    </Typography> 

                                    <Typography variant="body1" sx={{ marginTop:"20px", fontWeight: "bold" }}>
                                        CSV files obtained directly from an LMS will need to be adjusted into the format below
                                    </Typography> 

                                    <Box
                                        sx={{
                                            p: 1,
                                            border: "1px solid #ced4da",
                                            marginTop:"20px",
                                            marginBottom:"20px",
                                            borderRadius: "0",
                                            display:" flex",
                                            height: "100%",
                                            alignItems: "center",
                                            justifyContent: "space-around"
                                        }}
                                    >
                                        {this.props.tab === "BulkUpload" &&
                                            <Typography variant="body1">
                                                "Last Name, First Name", Email, Student or TA, Optional LMS ID
                                            </Typography>
                                        }

                                        {this.props.tab === "AdminTeamBulkUpload" &&
                                            <Box sx={{ display:"flex", flexDirection:"row", alignItems:"center" }}>
                                                <Typography variant='body1'>
                                                    TA Email<br></br>Team Name<br></br>"Last1, First1", Student Email 1, Optional LMS ID<br></br>"Last2, First2", Student Email 2, Optional LMS ID
                                                </Typography>
                                            </Box>
                                        }
                                        
                                        {this.props.tab === "BulkUpload" &&
                                            <Tooltip
                                                title={
                                                    <>
                                                        <p>Example of format in Excel: <br></br>Two Students and Two TAs </p>
                                                        <img
                                                            alt="Format Example"
                                                            style={{ width:"100%", height:"100px" }}
                                                            src={ studentImage }
                                                        ></img>
                                                    </>
                                                }
                                            >
                                                <IconButton size='small'> <HelpOutlineIcon /> </IconButton>
                                            </Tooltip>
                                        }

                                        {this.props.tab === "AdminTeamBulkUpload" &&
                                            <Tooltip
                                                title={
                                                    <Box sx={{ width:"100%" }}>
                                                        <p>
                                                            Example of format in Excel: <br></br>{this.state.teamsMsgs[this.state.currentTeamPic]}
                                                        </p>
                                                        <img
                                                            alt="Format Example"
                                                            style={{ width:"250px", height:"150px" }}
                                                            src={ this.state.teamsPics[this.state.currentTeamPic] }
                                                        ></img>

                                                        <Box sx={{ display:"flex", width:"100%", justifyContent:"flex-end", mt: 1 }}>
                                                            <IconButton onClick={this.changeTeamsExamplePic} size='small'>
                                                                <ArrowForwardIosIcon sx={{color:"#FFFFFF"}} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
                                                }
                                            >
                                                <IconButton size='small'> <HelpOutlineIcon /> </IconButton>
                                            </Tooltip>
                                        }
                                    </Box>
                                    <form
                                        onSubmit={ (e: any) => {
                                            e.preventDefault();
                                            this.debouncedSubmit(e);
                                        }
                                    }
                                        className="d-flex justify-content-center align-items-center rounded p-1 bg-white gap-3"
                                    >
                                        <input
                                            className='rounded form-control'
                                            type="file"
                                            name="file"
                                            aria-label="adminBulkUploadChooseFileButton"
                                            onChange={(e: any) => {
                                                this.setState({
                                                    selectedFile: e.target.files[0]
                                                })
                                            }}
                                        />

                                        {uploadRequestStatus === REQUEST_STATE.LOADING ?(
                                            <DynamicLoadingSpinner/>
                                        ):(
                                            <>
                                                <Button 
                                                onClick={() => {
                                                    confirmCreateResource("User")
                                                }}
                                                id="" className="" aria-label="cancelAdminBulkUploadButton">   
                                                    Cancel
                                                </Button>

                                                <Button className='primary-color' 
                                                    variant='contained' type="submit" aria-label="adminBulkUploadUploadFileButton"
                                                    style={{ display:  isLoading ? 'none' : 'inline-flex' }}
                                                >
                                                    Upload
                                                </Button>
                                            </>
                                        )}
                                    </form>

                                    {this.props.tab === "AdminTeamBulkUpload" &&
                                        <div className="form-position">
                                            <Typography variant="body1">
                                                Team Bulk Upload will also add students to course
                                            </Typography>
                                        </div>
                                    }
                                </div>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }
}

export default AdminBulkUpload;
