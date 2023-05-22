import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/ViewUsers/AdminViewUsers';
import AdminAddUser from '../Admin/AddUsers/AdminAddUser';
import AdminAddCourse from '../Admin/AddCourse/AdminAddCourse';
import AdminViewCourses from '../Admin/ViewCourses/AdminViewCourses';
import AdminViewAssessmentTask from '../Admin/ViewAssessmentTask/AdminViewAssessmentTask';
import books from './NavbarImages/books.png';
import form from './NavbarImages/form.png';
import user from './NavbarImages/user.png';
import teamIcon from './NavbarImages/teamIcon.png';
import AdminAddAssessmentTask from '../Admin/AddTask/AdminAddAssessmentTask';
import AdminDashboard from '../Admin/ViewCourses/AdminDashboard';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Users",
            users: null,
            user_id: null,
            addUser: true
        }
        this.setNewTab = (newTab) => {
            this.setState({activeTab: newTab});
        }
        this.setAddUserTabWithUser = (users, user_id) => {
            this.setState({activeTab: "AddUser", users: users, user_id: user_id, addUser: false});
        }
        this.setAddCourseTabWithCourse = (course, course_id) => {
            this.setState({activeTab: "AddCourse", course: course, course_id: course_id, addCourse: false});
        }
    }


    render() {
        //form reset for course
        const courseReset = () => {
            var courseName = document.getElementById("courseName");
            var courseCode = document.getElementById("courseCode");
            var term = document.getElementById("term");
            var year = document.getElementById("year");
            courseName.value="";
            courseCode.value="";
            term.value="";
            year.value="";
        }
        //form validation for course
        const courseValidate = () => {
            let isValid = true;
            var courseName = document.getElementById("courseName");
            var courseCode = document.getElementById("courseCode");
            var term = document.getElementById("term");
            var year = document.getElementById("year");
            if(courseName.value==="") {
                courseName.placeholder="This field is required.";
                courseName.value="";
                isValid = false;
            }
            if (courseCode.value==="") {
                courseCode.placeholder="This field is required.";
                courseCode.value="";
                isValid = false;
            }
            if (term.value==="") {
                term.placeholder="This field is required.";
                term.value="";
                isValid = false;
            }
            if (year.value==="") {
                year.placeholder="This field is required.";
                year.value="";
                isValid = false;
            } else if (isNaN(year.value)) {
                year.placeholder="Use 9999 format.";
                //console.log(lms_id.value)
                year.value="";
                isValid = false;
            } else if (year.value <=2000) {
                year.placeholder="Must be between 2000-3000";
                year.value="";
                isValid = false;
            } else if (year.value >=3000) {
                year.placeholder="Must be between 2000-3000";
                year.value="";
                isValid = false;
            }
            if (isValid===true){
                this.setNewTab("Courses")
            }
        }
        //form reset for Add User
        const Reset = () => {
            var firstName = document.getElementById("firstName");
            var lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            var password = document.getElementById("password");
            var role = document.getElementById("role");
            // var lms_id = document.getElementById("lms_id");
            // var owner_id = document.getElementById("owner_id");
            // clear text boxes
            firstName.value="";
            lastName.value="";
            email.value="";
            password.value="";
            role.value="";
            // lms_id.value="";
        }
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const confirmCreateUser = async () => {
            await sleep(1000);
            const errorElement = document.getElementsByClassName("text-danger");
            if(errorElement[0]===undefined) {
                this.setState({activeTab: "Users", users: null, user_id: null, addUser: true});
            }
        }
        return (
            <>
                <nav className="navbar">
                    <h1>SkillBuilder</h1>
                    <ul>
                        <button id="usersNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Users" || this.state.activeTab==="AddUser") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Users")}}>Users<img src={user} alt=""></img></button>
                        <button id="coursesNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Courses" || this.state.activeTab==="AddCourse") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Courses")}}>Courses<img src={books} alt=""></img></button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Teams" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Teams")}}>Teams<img src={teamIcon} alt=""></img></button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Assessment Tasks" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Assessment Tasks")}}>Assessment Tasks<img src={form} alt=""></img></button>
                    </ul>
                </nav>
                {this.state.activeTab==="Users" &&
                    <div className='container'>
                        <AdminViewUsers setAddUserTabWithUser={this.setAddUserTabWithUser} setNewTab={this.setNewTab}/>
                        <div className="d-flex justify-content-end">
                            <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddUser")}}>Add User</Button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminAddUser users={this.state.users} user_id={this.state.user_id} addUser={this.state.addUser}/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            {/* <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}}onClick={() => {this.setNewTab("Users")}}>Create User</Button> */}
                            <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {confirmCreateUser()}}>Create User</Button>
                            <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setState({activeTab: "Users", users: null, user_id: null, addUser: true})}}>Cancel</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {Reset()}}>Clear</Button>
                        </div>
                    </>
                }
                
                {this.state.activeTab==="AdminDashboard" &&
                    <>
                        <AdminDashboard/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}> </Button>
                            <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("Courses")}}> </Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseReset()}}> </Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}> </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Courses" &&
                    <div className='container'>
                        <AdminViewCourses/>
                        <div className='d-flex justify-content-end'>
                            <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddCourse")}}>Add Course</Button>
                            <Button className='mt-3 mb-3' style={{backgroundColor: "red", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddTask")}}>Add Task</Button>
                            <Button className='mt-3 mb-3' style={{backgroundColor: "red", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AdminDashboard")}}>Admin Dashboard</Button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddCourse" &&
                    <>
                        <AdminAddCourse/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}>Create Course</Button>
                            <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("Courses")}}>Cancel</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseReset()}}>Clear</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}>Validate</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddTask" &&
                    <>
                        <AdminAddAssessmentTask/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}>Create Task</Button>
                            <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("Courses")}}>Cancel</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseReset()}}>Clear</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {courseValidate()}}>Validate</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Teams" &&
                    <div className='container'>
                        <h1 className='text-center mt-5'>Teams</h1>
                    </div>
                }
                {this.state.activeTab==="Assessment Tasks" &&
                    <AdminViewAssessmentTask/>
                }
            </>
        )
    }
}