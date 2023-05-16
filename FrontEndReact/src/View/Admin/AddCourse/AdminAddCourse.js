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

<div id="outside">
                    <h1 class="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add & Edit Course</h1>
                    <div class="d-flex justify-content-around">Please add a new course or edit the current course</div>
                <div class="d-flex flex-column">
                    <div class="d-flex flex-row justify-content-between">
                        <div class="w-25 p-2 justify-content-between" style={{}}>
                            <label id="firstNameLabel">Course Name</label></div>
                        <div class="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                            <input type="text" id="courseName" name="newCourseName" className="m-1 fs-6" style={{}} placeholder="Course Name" required/></div>
                    </div></div>

                <div class="d-flex flex-column">
                    <div class="d-flex flex-row justify-content-between">
                        <div class="w-25 p-2 justify-content-between">
                            <label id="courseCodeLabel">Course Code</label></div>
                        <div class="w-75 p-2 justify-content-around ">
                            <input type="text" id="courseCode" name="newCourseCode" className="m-1 fs-6" style={{}} placeholder="Course Code" required/></div>
                </div></div>

                <div class="d-flex flex-column">
                    <div class="d-flex flex-row justify-content-between">
                    <div class="w-25 p-2 justify-content-between">
                        <label htmlFor="exampleDataList" className="form-label">Term</label></div>
                    <div class="w-75 p-2 justify-content-around">
                        <input type="text" id="term" name="newTerm" className="m-1 fs-6" style={{}} list="datalistOptions" placeholder="e.g. Spring" required/>
                        <datalist id="datalistOptions" style={{}}>
                            <option value="Fall"/>
                            <option value="Spring"/>
                            <option value="Summer"/>
                        </datalist></div>
                </div></div>

                <div class="d-flex flex-column">
                    <div class="d-flex flex-row justify-content-between">
                    <div class="w-25 p-2 justify-content-between"><label id="termLabel">Year</label></div>
                    <div class="w-75 p-2 justify-content-between"><input type="text" id="year" name="newTerm" className="m-1 fs-6" style={{}} placeholder="e.g. 2024" required/></div>
                </div></div>

</div>


                
            </React.Fragment>
        )
    }
}

export default AdminAddCourse;