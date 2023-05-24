import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../AddUsers/addStyles.css';
import Select from 'react-select';

class AdminAddAssessmentTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            errorMessage: null
        }
    }
    componentDidMount() {
        var createButton = document.getElementById("createAssessmentTaskButton");
        createButton.addEventListener("click", () => {
            // var taskID = document.getElementById("taskID").value;
            // var taskName = document.getElementById("taskName").value;
            // var courseID = document.getElementById("courseID").value;
            // var rubricID = document.getElementById("rubricID").value;
            // var roleID = document.getElementById("roleID").value;
            // var dueDate = document.getElementById("dueDate").value;
            // var suggestion = document.getElementById("suggestions").value;
            // fetch( "http://127.0.0.1:5000/api/assessment_task",
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json"
            //         },
            //         body: JSON.stringify({
            //             'at_id': taskID,
            //             'at_name': taskName,
            //             'course_id': courseID,
            //             'rubric_id': rubricID,
            //             'role_id': roleID,
            //             'due_date': dueDate,
            //             'suggestions': suggestion
            //     })
            // })
            // .then(res => res.json())
            // .then(
            //     (result) => {
            //         if(result["success"] === false) {
            //             this.setState({
            //                 errorMessage: result["message"]
            //             })
            //         }
            //     },
            //     (error) => {
            //         this.setState({
            //             error: error
            //         })
            //     }
            // )
        });
    }
    render() {
        const { error , errorMessage} = this.state;
        const courseNumber = [
            {
                value: '1234',
                label: '1234'
            },
            {
                value: '123',
                label: '123'
            },
            {
                value: '1623',
                label: '1623'
            }
        ]
        const taskType = [
            {
                value: 'Admin',
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
        // var currentDate = new Date().getDate(); //To get the Current Date
        // var month = new Date().getMonth() + 1; //To get the Current Month
        // var year = new Date().getFullYear(); //To get the Current Year
        // console.log(currentDate,'/',month,'/',year);
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
                    <h1 className="d-flex justify-content-around" style={{margin:".5em auto auto auto"}}>Add & Edit Assessment Task</h1>
                    <div className="d-flex justify-content-around">Please add a new task or edit the current assesment task</div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="createdByLabel">Created By</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>ID 246</div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="dateCreatedLabel">Date Created</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>currentDate</div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between" style={{}}>
                                <label id="taskNameLabel">Task Name</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around" style={{ maxWidth:"100%"}}>
                                <input type="text" id="taskName" name="newTaskName" className="m-1 fs-6" style={{}} placeholder="Task Name" required/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-25 p-2 justify-content-between">
                                <label id="taskTypeLabel">Task Type</label>
                            </div>
                            <div className="w-75 p-2 justify-content-around ">
                                <Select id="select" options={taskType}/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column">
                        <div className="d-flex flex-row justify-content-between">
                            <div className="w-20 p-2 justify-content-between">
                                <label id="dueDate">Due Date</label>
                            </div>
                            <div className="w-30 p-2 justify-content-around">
                                <input type="text" id="dueDate" name="newDueDate" className="m-1 fs-6" style={{width:"100%"}} placeholder="mm/dd/yyyy" required/>
                            </div>
                            <div className="w-20 p-2 justify-content-between">
                                <label id="courseNumberLabel">Course Number</label>
                            </div>
                            <div className="w-30 p-2 justify-content-around ">
                                <Select options={courseNumber}/>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default AdminAddAssessmentTask;