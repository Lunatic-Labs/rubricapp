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
                <div id="outside">
                    {this.state.error &&
                        <div className="alert alert-danger" role="alert">
                            {this.state.errorMessage}
                        </div>
                    }
                    <h1 className="text-center mt-5">Student Bulk Upload</h1>
                    <div className="d-flex flex-column p-2 m-4">
                        <div style={{"height":"8rem"}}>
                            <p id="Instructions" style={{fontWeight: "bold"}}>Upload a CSV or XLSX file with the following format to automatically register your students. The headers in the examples - Student, ID, SIS Login ID- should not be included in your file.</p>
                        </div>
                        <p className='h4' id="Instructions">CSV File Format</p>
                        <div className="d-flex justify-content-center" style={{ height: "7rem"}}>
                            <div style={{ height: "5rem", backgroundColor: "white", width: "30em", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", borderRadius: "10px" }}>
                                <p id="CSV Example"> Student, ID, SIS Login ID</p>
                                <p id="CSV Example2" > "Allison, Jeremy", 50717, jcallison1@lipscomb.mail.edu</p>
                            </div>
                        </div>
                        <p className="h4" id="Instructions">XLSX File Format</p>
                        <div className=" d-flex justify-content-center" style={{ height: "8rem"}}>
                            <div style={{ height: "5rem", backgroundColor: "white", width: "30em", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", borderRadius: "10px" }}>
                                <table id="Spreadsheet Example"> 
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
                                </table>
                            </div>
                        </div>
                        <div style = {{height: "5rem"}}>
                        <form className="d-flex justify-content-center align-items-center rounded" style={{backgroundColor: "white"}} onSubmit={this.onFormSubmit}>
                            <div className='d-flex align-items-center'>
                                <input className='w-75 rounded' style={{marginTop: "10px"}} type="file" name="file" onChange={(e) => this.onChange(e)}/>
                            </div>
                            <button className="w-25 btn btn-primary" type="submit">Submit</button>
                        </form>
                        </div>
                        <div className= "d-flex justify-content-center" style = {{fontWeight: "bold", height: "2rem"}}>
                            <ol>
                                <p>
                                    If error was given, no user was added. Please reread the criteria and fix any mistakes.
                                </p>
                            </ol>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
    
}

export default AdminBulkUpload;