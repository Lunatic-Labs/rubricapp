import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import { API_URL } from '../../../../App';
import ErrorMessage from '../../../Error/ErrorMessage';

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

        fetch(API_URL + `/student_bulk_upload?course_id=${this.props.chosenCourse["course_id"]}`, {
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
        const {
            error,
            errorMessage
        } = this.state;
        var backgroundColor = "#abd1f9";
        var borderRadius = "10px";
        var height = "18rem";
        var width = "40rem";
        return (
            <React.Fragment>
                { error &&
                    <ErrorMessage 
                        add={true}
                        resource={"CSV"}
                        errorMessage={error.message}
                    />
                }
                { errorMessage &&
                    <ErrorMessage
                        add={true}
                        resource={"CSV"}
                        errorMessage={errorMessage}
                    />
                }
                <div
                    className={(!error && !errorMessage) ? 'mt-5':''}
                    style={{
                        backgroundColor: backgroundColor,
                        borderRadius: borderRadius
                    }}
                >
                    <h1 className="text-center pt-4">
                        Student Bulk Upload
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
                                borderRadius: borderRadius,
                                height: height,
                                width: width
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
                                    <p>
                                        "Doe, John", jcdoe@skillbuilder.mail.edu, 78983
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
                                    <p>Doe, John</p>
                                    <p>jcdoe@skillbuilder.mail.edu</p>
                                    <p>78983</p>
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
