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

        fetch("http://127.0.0.1:5000/api/uploadcsv", {
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
                        Bulk Upload
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
                                    '
                                    style={{
                                        width: "90%",
                                        height: "fit-content",
                                        borderRadius: "10px",
                                        backgroundColor: "#abd1f9"
                                    }}
                                >
                                    <p
                                        className='
                                            p-1
                                        '
                                    >
                                        Student, ID, SIS Login ID
                                        <br></br>
                                        "Allison, Jeremy", 50717, jcallison1@lipscomb.mail.edu
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
                                    p-3
                                '
                            >
                                If you have a SpreadSheet please export from the format below to a CSV file format.
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
                                    text-center
                                '
                                style={{
                                    height: "5rem",
                                    width: "90%",
                                    borderRadius: "10px",
                                }}
                                >
                                <table
                                    id="Spreadsheet Example"
                                    className='
                                        table
                                        rounded
                                    '
                                    style={{
                                        backgroundColor: "#abd1f9"
                                    }}
                                > 
                                    <tbody>
                                        <tr>
                                            <th>Student</th>
                                            <th>ID</th> 
                                            <th>SIS Login ID</th>
                                        </tr>
                                        <tr>
                                            <td>Allison, Jeremy</td>
                                            <td>50717</td>
                                            <td>jcallison1@lipscomb.mail.edu</td>
                                        </tr>
                                    </tbody>
                                </table>
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