// import { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.css';
// import Button from '@mui/material/Button';
// import AdminViewUsers from '../Admin/ViewUsers/AdminViewUsers';
// import AdminAddUser from '../Admin/AddUsers/AdminAddUser';
// import AdminViewCourses from '../Admin/ViewCourses/AdminViewCourses';
// import AdminViewAssessmentTask from '../Admin/ViewAssessmentTask/AdminViewAssessmentTask';
// import books from './NavbarImages/books.png';
// import user from './NavbarImages/user.png';
// import teamIcon from './NavbarImages/teamIcon.png';
// import list from './NavbarImages/list.png';

// export default class Navbar extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             activeTab: "Users"
//         }
//         this.setNewTab = (newTab) => {
//             this.setState({activeTab: newTab});
//         }
//     }
//     render() {
//         return (
//             <>
//                 <link rel="stylesheet" href="path"></link>
//                 <nav className="navbar">
//                     <h1>SkillBuilder</h1>
//                     <ul>
//                         <button id="usersNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Users" || this.state.activeTab==="AddUser") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Users")}}>Users<img src={user} alt=""></img></button>
//                         <button id="coursesNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Courses" || this.state.activeTab==="AddCourse") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Courses")}}>Courses<img src={books} alt=""></img></button>
//                         <button className="btn" style={{backgroundColor: (this.state.activeTab==="Teams" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Teams")}}>Teams<img src={teamIcon} alt=""></img></button>
//                         <button className="btn" style={{backgroundColor: (this.state.activeTab==="Assessment Tasks" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Assessment Tasks")}}>Assessment Tasks<img src={list} alt=""></img></button>
//                     </ul>
//                 </nav>
//                 {this.state.activeTab==="Users" &&
//                     <div className='container'>
//                         <AdminViewUsers/>
//                         <div className="d-flex justify-content-end">
//                             <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddUser")}}>Add User</Button>
//                         </div>
//                     </div>
//                 }
//                 {this.state.activeTab==="AddUser" &&
//                     <>
//                         <AdminAddUser/>
//                         <div className="d-flex flex-row justify-content-center align-items-center gap-3">
//                             <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}}onClick={() => {this.setNewTab("Users")}}>Create User</Button>
//                             <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("Users")}}>Cancel</Button>
//                         </div>
//                     </>
//                 }
//                 {this.state.activeTab==="Courses" &&
//                     <div className='container'>
//                         <AdminViewCourses/>
//                         <div className='d-flex justify-content-end'>
//                             <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddCourse")}}>Add Course</Button>
//                         </div>
//                     </div>
//                 }
//                 {this.state.activeTab==="AddCourse" &&
//                     <div className='container'>
//                         <h1 className='text-center mt-5'>Add Courses</h1>
//                     </div>
//                 }
//                 {this.state.activeTab==="Teams" &&
//                     <div className='container'>
//                         <h1 className='text-center mt-5'>Teams</h1>
//                     </div>
//                 }
//                 {this.state.activeTab==="Assessment Tasks" &&
//                 <>
//                     <AdminViewAssessmentTask/>
//                 </>
//                 }
//             </>
//       )
//     }
// }

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

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Users"
        }
        this.setNewTab = (newTab) => {
            this.setState({activeTab: newTab});
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
            console.log("top of reset")
            var firstName = document.getElementById("firstName");
            var lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            var password = document.getElementById("password");
            var role = document.getElementById("role");
            // var lms_id = document.getElementById("lms_id");
            // var owner_id = document.getElementById("owner_id");
            // clear text boxes
            console.log(email.value)
            firstName.value="";
            lastName.value="";
            email.value="";
            password.value="";
            role.value="";
            // lms_id.value="";
            console.log(email.value)
        }
        //form validation for Add User
        const Validate = () => {
            let isValid = true;
            var firstName = document.getElementById("firstName");
            var lastName = document.getElementById("lastName");
            const email = document.getElementById("email");
            var password = document.getElementById("password");
            var role = document.getElementById("role");
            // var lms_id = document.getElementById("lms_id");
            if (firstName.value==="") {
                firstName.placeholder="This field is required.";
                firstName.value="";
                isValid = false;
            } else {
                //console.log("first name good")
                //console.log(firstName.value)
            }
            // validate the last name entry
            if(lastName.value===""){
                lastName.placeholder="This field is required.";
                isValid = false;
            } else {
                //console.log("last name good")
            }
            //lms id validation was told this is now not required
            /* if (lms_id.value==="") {
                    lms_id.placeholder="This field is required.";
                    //console.log(lms_id.value)
                    isValid = false;
                } else if (isNaN(lms_id.value)) {
                    lms_id.placeholder="Use 99999 format.";
                    //console.log(lms_id.value)
                    lms_id.value="";
                    isValid = false;
                } 
                else if (Object.keys(lms_id.value).length !== 5 ) {
                    lms_id.placeholder="Use 5-digit code.";
                    //console.log(lms_id.value)
                    lms_id.value="";
                    isValid = false;
                } else{
                    console.log("LMS Good")
                }
                */
            //validate email
            const emailPattern =
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
            if (email.value==="") {
                email.placeholder="This field is required.";
                email.value="";
                isValid = false;
            } else if(!(!this.state.email || emailPattern.test(this.state.email) === false)){
                email.placeholder="Please enter a valid email";
                email.value="";
                isValid=false;
            }
            //validate password
            // const letter = /(?=.*?[a-z])/;
            const digitsRegExp = /(?=.*?[0-9])/;
            const digitsPassword = digitsRegExp.test(password.value);
            if (password.value==="") {
                password.placeholder="This field is required.";
                password.value="";
                isValid = false;
            } else if (Object.keys(password.value).length <= 7 ) {
                password.placeholder="Minimum of 8 characters required";
                password.value="";
                isValid = false;
            } else if(!digitsPassword){
                password.placeholder="At least one digit"
                password.value="";
                isValid = false;
            }
            if (role.value==="") {
                role.placeholder="This field is required.";
                role.value="";
                isValid = false;
            }
            // prevent the default action of submitting the form if any entries are invalid 
            if (isValid === true) {
                //evt.preventDefault;
                this.setNewTab("Users")
            } else {
                console.log("it is false")
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
                        <AdminViewUsers/>
                        <div className="d-flex justify-content-end">
                            <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddUser")}}>Add User</Button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminAddUser/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button id="createButton" style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}}onClick={() => {this.setNewTab("Users")}}>Create User</Button>
                            <Button style={{backgroundColor: "black", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("Users")}}>Cancel</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {Reset()}}>Clear</Button>
                            <Button style={{backgroundColor: "grey", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {Validate()}}>Validate</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Courses" &&
                    <div className='container'>
                        <AdminViewCourses/>
                        <div className='d-flex justify-content-end'>
                            <Button className='mt-3 mb-3' style={{backgroundColor: "#2E8BEF", color:"white", margin: "10px 5px 5px 0"}} onClick={() => {this.setNewTab("AddCourse")}}>Add Course</Button>
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