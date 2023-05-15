import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';

class AdminAddCourse extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
        }
    }
    componentDidMount() {
        var createButton = document.getElementById("createButton");
        createButton.addEventListener("click", () => {
            var courseName = document.getElementById("courseName").value;
            var courseCode = document.getElementById("courseCode").value;
            var term = document.getElementById("term").value;
            var year = document.getElementById("year").value;
            fetch( "http://127.0.0.1:5000/api/course",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "course_name": courseName,
                        "course_code": courseCode,
                        "term": term,
                        "year": year
                })
            })
            .then(res => res.json())
            .then(
                (result) => {
                    if(result["success"] === false) {
                        this.setState({
                            errorMessage: result["message"]
                        })
                    }
                },
                (error) => {
                    this.setState({
                        error: error
                    })
                }
            )
        });
    }
    render() {
        const { error , errorMessage} = this.state;

        return (
            <React.Fragment>
                { error &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new course resulted in an error: { error.message }</h1>
                        </React.Fragment>
                }
                { errorMessage &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new course resulted in an error: { errorMessage }</h1>
                        </React.Fragment>
                }
                <div id='outside'>
                <h1 className="text-center mt-5">Add New Course</h1>
                <div className="d-flex flex-column p-2 m-4"> 
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="firstNameLabel">Course Name</label>
                        <input type="text" id="courseName" name="newCourseName" className="m-1 fs-6" style={{}} placeholder="Course Name" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="courseCodeLabel">Course Code</label>
                        <input type="text" id="courseCode" name="newCourseCode" className="m-1 fs-6" style={{}} placeholder="Course Code" required/>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                    <label htmlFor="exampleDataList" className="form-label">Term</label>
                        <input type="text" id="term" name="newTerm" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Spring" required/>
                        <datalist id="datalistOptions" style={{}}>
                            <option value="Fall"/>
                            <option value="Spring"/>
                            <option value="Summer"/>
                        </datalist>
                    </div>
                    <div className="col d-flex justify-content-center m-1" style={{"height":"3rem"}}>
                        <label id="termLabel">Year</label>
                        <input type="text" id="year" name="newTerm" className="m-1 fs-6" style={{}} placeholder="e.g. 2024" required/>
                    </div>

                </div>
                </div>
                
            </React.Fragment>
        )
    }
}

export default AdminAddCourse;