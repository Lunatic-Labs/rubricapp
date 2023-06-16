import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
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
        let files = e.target.files;
        this.setState({
            selectedFile: files[0]
        });
        let reader = new FileReader();
        reader.readAsText(
            files[0]
        );
    }

    onFormSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append(
            'csv_file',
            this.state.selectedFile
        );
        fetch(
            (
                `http://127.0.0.1:5000/api/studentbulkuploadcsv?course_id=${this.props.chosenCourse["course_id"]}&owner_id=${this.props.user["user_id"]}`
            ),
            {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(result => { 
                if (result.success === false) {
                    this.setState({
                        errorMessage: result.message
                    });
                } else {
                    setTimeout(() => {
                        this.props.setNewTab("Users");
                    }, 1000);
                }
            })
            .catch((error) => {
                this.setState({
                    error: error.toString()
                });
            }
        );
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
                        className='
                            mainBody
                            d-flex
                            p-5
                            gap-5
                        '
                    >
                        <div
                            className='
                                leftSide
                                d-flex
                                flex-column
                                justify-content-between
                                align-items-center
                                bg-white
                                p-3
                            '
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
                                style={{
                                    height: "5rem"
                                }}
                            >
                                Upload a CSV file with the following format to automatically register your students.
                                Each row must have the student name and email. The third column is optional containing the LMS ID.
                            </p>
                            <p
                                className='
                                    h4
                                '
                                style={{
                                }}
                            >
                                CSV File Format
                            </p>
                            <table
                                    className='
                                        table
                                        w-75
                                    '
                                    style={{
                                        backgroundColor: backgroundColor,
                                        borderRadius: borderRadius,
                                        height: "2.5rem"
                                    }}
                            >
                                <tbody>
                                    <tr>
                                        <td>"Doe, John", jcdoe@skillbuilder.mail.edu, 78983</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div
                            className='
                                rightSide
                                d-flex
                                flex-column
                                justify-content-between
                                align-items-center
                                bg-white
                                p-3
                            '
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
                                style={{
                                    height: "5rem"
                                }}
                            >
                                If you have a SpreadSheet, please export from the format below to a CSV file format. Please do not utilize any headers for either of the noted formats. 
                            </p>
                            <p
                                className="
                                    h4
                                "
                                style={{
                                }}
                            >
                                Spreadsheet File Format
                            </p>
                            <table
                                className='
                                    table
                                    w-75
                                '
                                style={{
                                    backgroundColor: backgroundColor,
                                    borderRadius: borderRadius,
                                    height: "2.5rem"
                                }}
                            >
                                <tbody>
                                    <tr>
                                        <td>Doe, John</td>
                                        <td>jcdoe@skillbuilder.mail.edu</td>
                                        <td>78983</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div
                        className='
                            row
                            d-flex
                            justify-content-center
                            w-100
                        '
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
                            style={{
                                width: width
                            }}
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
                        <p className='m-4 fw-bold'>
                            If error was given, no user was added. Please reread the criteria and fix any mistakes.
                        </p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminBulkUpload;