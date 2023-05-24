import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import Select from 'react-select';

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null,
            selectedCourseNumber: '',
        };
        this.handleCourseNumberChange = this.handleCourseNumberChange.bind(this);
    }
    handleCourseNumberChange(event) {
        this.setState({ selectedCourseNumber: event.target.value });
    }
    componentDidMount() {
        var createTask = document.getElementById("createTask");
        createTask.addEventListener("click", () => {
            // var taskID = document.getElementById("taskID").value;
            // var adminID = document.getElementById("adminID").value
            // var taskName = document.getElementById("taskName").value;
            // var courseID = document.getElementById("courseID").value;
            // var rubricID = document.getElementById("rubricID").value;
            // var roleID = document.getElementById("roleID").value;
            // var dueDate = document.getElementById("dueDate").value;
            // var suggestion = document.getElementById("suggestions").value;
             var course_number= document.getElementById("course-number").value;
            //var selectTaskTypeDropdown = document.getElementById("selectTaskTypeDropdown").value;
            //console.log(selectTaskTypeDropdown)
            console.log(course_number)
            //console.log(this.value.selectedCourseNumber)
            /*fetch( "http://127.0.0.1:5000/api/assessment_task",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        'at_id': taskID,
                        'admin_id': adminID,
                        'at_name': taskName,
                        'course_id': courseID,
                        'rubric_id': rubricID,
                        'role_id': roleID,
                        'due_date': dueDate,
                        'suggestions': suggestion
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
            )*/
        });
    }
    render() {
        const { error , errorMessage} = this.state;
        var courses = this.props.courses;

        //this needs to be a loop that will return all of the current course numbers
        
        const courseNumbers = []
        console.log(courses)
        if (courses){
        console.log(courses)
            for(var i = 0; i < courses[0].length; i++) {
            courseNumbers = [...courseNumbers, courses[0][i]["course_number"]];
        }
    }
        const taskType = [
            {
                value: 'admin',
                label: 'Admin'
            },
            {
                value: 'TA',
                label: 'TA'
            },
            {
                value: 'Student',
                label: 'Student'
            }
        ]



        //const courseNumbers = [101, 201, 301, 401]; // Array of course numbers
        const { selectedCourseNumber } = this.state;


        
        var currentDate = new Date().getDate(); //To get the Current Date
        var month = new Date().getMonth() + 1; //To get the Current Month
        var year = new Date().getFullYear(); //To get the Current Year
        console.log(currentDate,'/',month,'/',year);
        return (
            <React.Fragment>
                { error &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new assessment task resulted in an error: { error.message }</h1>
                        </React.Fragment>
                }
                { errorMessage &&
                        <React.Fragment>
                            <h1 className="text-danger text-center p-3">Creating a new assessment task resulted in an error: { errorMessage }</h1>
                        </React.Fragment>
                }
                <div id="outside">
                    <h1 class="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add & Edit Assessment Task</h1>
                    <div class="d-flex justify-content-around">Please add a new task or edit the current assesment task</div>
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="w-25 p-2 justify-content-between" style={{}}>
                                <label id="createdByLabel">Created By</label>
                            </div>
                            <div class="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>adminID</div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="w-25 p-2 justify-content-between" style={{}}>
                                <label id="dateCreatedLabel">Date Created</label>
                            </div>
                            <div class="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>{month}/{currentDate}/{year}</div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="w-25 p-2 justify-content-between" style={{}}>
                                <label id="taskNameLabel">Task Name</label>
                            </div>
                            <div class="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="taskName" name="newTaskName" className="m-1 fs-6" style={{}} placeholder="Task Name" required/>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="w-25 p-2 justify-content-between">
                                <label id="taskTypeLabel">Task Type</label>
                            </div>
                            <div class="w-75 p-2 justify-content-around ">
                                <Select id="selectTaskTypeDropdown" options={taskType}/>
                            </div>
                        </div>
            </div>
                    <div class="d-flex flex-column">
                        <div class="d-flex flex-row justify-content-between">
                            <div class="w-20 p-2 justify-content-between">
                                <label id="dueDate">Due Date</label>
                            </div>
                            <div class="w-30 p-2 justify-content-around">
                                <input type="text" id="dueDate" name="newDueDate" className="m-1 fs-6" style={{width:"100%"}} placeholder="mm/dd/yyyy" required/>
                            </div>
                            <div class="w-20 p-2 justify-content-between">
                                <label id="courseNumberLabel">Course Number</label>
                            </div>
                            <div class="w-30 p-2 justify-content-around ">
                                <Select id="selectCourseNumberDropdown" options={courseNumbers}/>
                            </div>
                        </div>
            </div>
                    <div><div>
        <label htmlFor="course-number">Select Course Number:</label>
        <select id="course-number" value={selectedCourseNumber} onChange={this.handleCourseNumberChange}>
          <option value="">Select...</option>
          {courseNumbers.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
        <p id="ptag">Selected Course Number: {selectedCourseNumber}</p>
      </div>
    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;