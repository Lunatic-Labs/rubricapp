import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import { API_URL } from '../../../../App';
import { genericResourcePOST } from '../../../../utility';

class AdminBulkUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            selectedFile: null,
        }
    }

    onChange(e) {
        let files= e.target.files;
        this.setState({ selectedFile: files[0] });

        let reader = new FileReader();
        reader.readAsText(files[0]);
    }

    onFormSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('csv_file', this.state.selectedFile);

        let url =  this.props.addTeam ?
            API_URL + `/team_bulk_upload?course_id=${this.props.chosenCourse["course_id"]}`:
            API_URL + `/team/${this.props.team["team_id"]}`;
        genericResourcePOST(url, this, formData);
    }

    render() {
        return (
            <React.Fragment>
                <div
                    className='
                        mt-5
                    '
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
                        Team Bulk Upload
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
                                Upload a CSV file with the following format to automatically register people to team.
                                Each row should include the team name, TA email, and student emails. TAs not required.
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
                                    <p>
                                    SKIL-Team, ta@email.com, student@email.com
                                    </p>
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
                                If you have a Excel Spreadsheet (.XLSX) file please use the specified format below.  Please do not utilize any headers for either of the noted formats. 
                            </p>
                        </div>
                        <p
                            id="Instructions"
                            className="
                                h4
                                mt-1
                            "
                        >
                            Spreadsheet File Format
                        </p>
                        <div
                            className="
                                d-flex
                                justify-content-center
                            "
                            style={{
                                height: "8rem"
                                
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
                                    width: "90%",
                                    height: "fit-content",
                                    borderRadius: "10px",
                                    backgroundColor: "#abd1f9"
                                }}
                                >
                                <div
                                    className='
                                        d-flex
                                        rounded
                                        gap-2
                                    '
                                    style={{
                                        backgroundColor: "#abd1f9",
                                    }}
                                >
                                    <p>SKIL-Team</p>
                                    <p>ta@email.com</p>
                                    <p>student@email.com</p>
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
            </React.Fragment>
        )
    }
    
}

export default AdminBulkUpload;