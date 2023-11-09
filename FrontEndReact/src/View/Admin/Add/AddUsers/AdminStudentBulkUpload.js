import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import { API_URL } from '../../../../App';


class AdminBulkUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            selectedFile: null,
            tabToString: {
                "BulkUpload": "Student",
                "AdminTeamBulkUpload": "Team",
                "StudentTeamBulkUpload": "Student & Team"
            },
            tabToFormat: {
                "BulkUpload": "\"First, Last\", Email, LMS ID",
                "AdminTeamBulkUpload": "Team, TA email, Student email",
                "StudentTeamBulkUpload": "Student & Team format"
            }
        }
    }

    onChange(e) {
        let files= e.target.files;
        console.warn("data file",files)
        this.setState({ selectedFile: files[0] });

        let reader = new FileReader();
        reader.readAsText(files[0])
        reader.onload=(e)=>{
            console.warn("data", e.target.result)
        }
    }

    onFormSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('csv_file', this.state.selectedFile);

        if (this.props.tab==="BulkUpload") {
            fetch(`http://127.0.0.1:5000/api/student_bulk_upload?course_id=${this.props.chosenCourse["course_id"]}`, {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => { 
                if (data.success === false) {
                    this.setState({ error: true, errorMessage: data.message });
                } else {
                    console.log(data);
                    this.setState({error: false});
                    setTimeout(() => {
                        this.props.setNewTab("Users");
                    }, 1000);
                }
            })
            .catch((error) => {
                this.setState({ error: true, errorMessage: error.toString() });
            });
        }

        if (this.props.tab==="AdminTeamBulkUpload") {
            fetch((
                API_URL + `/team_bulk_upload?course_id=${this.props.chosenCourse["course_id"]}`
                ),        
            {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => { 
                if (data.success === false) {
                    this.setState({ error: true, errorMessage: data.message });
                } else {
                    console.log(data);
                    this.setState({error: false});
                    setTimeout(() => {
                        this.props.setNewTab("Teams");
                    }, 1000);
                }
            })
            .catch((error) => {
                this.setState({ error: true, errorMessage: error.toString() });
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <>
                    <div className="d-flex justify-content-center gap-3 mt-5">
                        <button
                            className= {"mb-3 mt-3 btn " +  (this.props.tab==="BulkUpload" ? "btn-primary" : "btn-secondary")}
                            onClick={() => {
                                this.props.setNewTab("BulkUpload");
                            }}
                        >
                            Students
                        </button>
                        <button
                            className= {"mb-3 mt-3 btn " +  (this.props.tab==="AdminTeamBulkUpload" ? "btn-primary" : "btn-secondary")}
                            onClick={() => {
                                this.props.setNewTab("AdminTeamBulkUpload");
                            }}
                        >
                            Teams
                        </button>
                        <button
                            className= {"mb-3 mt-3 btn " +  (this.props.tab==="StudentTeamBulkUpload" ? "btn-primary" : "btn-secondary")}
                            onClick={() => {
                                this.props.setNewTab("StudentTeamBulkUpload");
                            }}
                        >
                            Students & Teams
                        </button>
                    </div>
                    <div
                        style={{
                            backgroundColor: "#abd1f9",
                            borderRadius: "10px"
                        }}
                    >
                        {this.state.error &&
                            <div
                                className="
                                    alert
                                    alert-danger
                                "
                            >
                                {this.state.errorMessage}
                            </div>
                        }
                        <h1
                            className="
                                text-center
                                pt-4
                            "
                        >
                            {this.state.tabToString[this.props.tab]} Bulk Upload
                        </h1>
                        <div
                            className="
                                d-flex
                                flex-row
                                justify-content-center
                            "
                        >
                            <div
                                className="
                                    d-flex
                                    flex-column
                                    p-2
                                    m-4
                                    bg-white
                                    gap-3
                                "
                                style={{
                                    borderRadius: "10px"
                                }}
                            >
                            <div
                                className="
                                    fw-bold
                                "
                                style={{
                                    width: "50vw"
                                }}
                            >
                                <h2>
                                    Instructions
                                </h2>
                                <p
                                    id="Instructions"
                                    className='
                                    h6
                                    fw-bold
                                    '
                                >
                                    Upload a CSV or XLSX file to bulk upload.
                                </p>
                                <p
                                    id="Instructions"
                                    className='
                                    h6
                                    fw-bold
                                    '
                                >
                                    CSV files optained directly from an LMS will need to be edited to fit the bulk upload format:
                                </p>
                            </div>
                            <div
                                className="
                                    d-flex
                                    flex-column
                                    justify-content-center
                                "
                                style={{
                                    height: "7rem"
                                    
                                }}
                            >
                                <div  
                                    className='
                                        d-flex
                                        justify-content-center
                                        align
                                        text-center
                                        pt-3
                                    '
                                    style={{
                                        
                                        height: "fit-content",
                                        borderRadius: "10px",
                                        backgroundColor: "#E0E0E0"
                                    }}
                                    >
                                    <div
                                        className='
                                            d-flex
                                            rounded
                                            gap-2
                                        '
                                    >
                                        <p>{this.state.tabToFormat[this.props.tab]}</p>
                                    </div>
                                </div>
                                <p></p>
                                <p
                                    id="Instructions"
                                    className='
                                    h6
                                    fw-bold
                                    '
                                >
                                    Example of format in Excel:
                                </p>
                                <p>
                                    INSERT PHOTO HERE
                                </p>
                            </div>
                            </div>
                        </div>
                        <div
                            className="
                                d-flex
                                justify-content-center
                            "
                        >
                            <form
                                className="
                                    d-flex
                                    justify-content-center
                                    align-items-center
                                    rounded
                                    p-1
                                    bg-white
                                    gap-3
                                "
                                onSubmit={
                                    this.onFormSubmit
                                }
                            >
                                <input
                                    className='
                                        rounded
                                        form-control
                                        mt-2
                                    '
                                    type="file"
                                    name="file"
                                    onChange={(e) => this.onChange(e)}
                                />
                                <button
                                    className="
                                        btn
                                        btn-primary
                                    "
                                    type="submit"
                                >
                                    Upload
                                </button>
                            </form>
                        </div>
                        <div
                            className="
                                d-flex
                                justify-content-center
                                fw-bold
                            "
                        >
                            <p></p>
                        </div>
                    </div>
                </>
            </React.Fragment>
        )
    }
    
}

export default AdminBulkUpload;