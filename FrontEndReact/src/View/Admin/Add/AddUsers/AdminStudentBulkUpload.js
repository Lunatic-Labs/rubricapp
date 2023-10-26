import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';

class AdminBulkUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            selectedFile: null,
            tabToSTring: {
                "BulkUpload": "Student",
                "AdminTeamBulkUpload": "Team",
                "StudentTeamBulkUpload": "Student & Team"
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
                            {this.state.tabToSTring[this.props.tab]} Bulk Upload
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
                                    borderRadius: "10px",
                                    width: "35vw"
                                }}
                            >
                                <p
                                    className='
                                        mt-3
                                        fw-bold
                                    '
                                >
                                    Upload a CSV file with the following format to automatically register your students. Each row must have 3 elements in the order shown below.
                                </p>
                                <p
                                    className='
                                        h4
                                        mt-1
                                    '
                                    id="Instructions"
                                >
                                    CSV File Format
                                </p>
                                <div
                                    className="
                                        d-flex
                                        justify-content-center
                                    "
                                    style={{
                                        height: "fit-content"
                                    }}
                                >
                                    <div
                                        className='
                                            d-flex
                                            justify-content-center
                                            text-center
                                            pt-3
                                        '
                                        style={{
                                            width: "90%",
                                            height: "fit-content",
                                            borderRadius: "10px",
                                            backgroundColor: "#abd1f9"
                                        }}
                                    >
                                        <p>"First, Last", Email, LMS ID</p>
                                    </div>
                                </div>
                            </div>
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
                                    width: "35vw"
                                }}
                            >
                                <p
                                    id="Instructions"
                                    className='
                                    mt-3
                                    fw-bold
                                    '
                                >
                                    .XLSX (Excel Spreadsheet format) uses the format below.
                                </p>
                            </div>
                            <p
                                id="Instructions"
                                className="
                                    h4
                                    mt-1
                                "
                            >
                                XLSX File Format
                            </p>
                            <div
                                className="
                                    d-flex
                                    flex-column
                                    justify-content-center
                                "
                                style={{
                                    height: "14rem"
                                    
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
                                        <p>First, Last, Email, LMS ID</p>
                                    </div>
                                </div>
                                <p>Example .XLSX</p>
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
                                            flex-column
                                            rounded
                                            gap-2
                                            margin-2
                                        '
                                    >
                                        <p>Turner, Austin, taustin@mail.university.edu, 12345</p>
                                        <p>Landon, Austin, laustin@mail.university.edu, 22345</p>
                                        <p>Connor, Austin, caustin@mail.university.edu, 32345</p>
                                    </div>
                                </div>
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
                            <ol>
                                <p
                                    className='
                                        m-3
                                    '
                                >
                                    If error was given, no user was added. Please reread the criteria and fix any mistakes.
                                </p>
                            </ol>
                        </div>
                    </div>
                </>
            </React.Fragment>
        )
    }
    
}

export default AdminBulkUpload;