import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/ViewUsers/AdminViewUsers';
import AdminAddUser from '../Admin/AddUsers/AdminAddUser';
import AdminViewCourses from '../Admin/ViewCourses/AdminViewCourses';
import AdminViewAssessmentTask from '../Admin/ViewAssessmentTask/AdminViewAssessmentTask';
import books from './NavbarImages/books.png';
import form from './NavbarImages/form.png';
import user from './NavbarImages/user.png';

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
        return (
            <>
                <nav className="navbar">
                    <h1>SkillBuilder</h1>
                    <ul>
                        <button id="usersNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Users" || this.state.activeTab==="AddUser") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Users")}}>Users<img src={user} alt=""></img></button>
                        <button id="coursesNavbarTab" className="btn" style={{backgroundColor: ((this.state.activeTab==="Courses" || this.state.activeTab==="AddCourse") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Courses")}}>Courses<img src={form} alt=""></img></button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Teams" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Teams")}}>Teams<img src={books} alt=""></img></button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Assessment Tasks" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Assessment Tasks")}}>Assessment Tasks<img src={books} alt=""></img></button>
                    </ul>
                </nav>
                {this.state.activeTab==="Users" &&
                    <div className='container'>
                        <AdminViewUsers/>
                        <div className="d-flex justify-content-end">
                            <Button className='mt-3 mb-3' onClick={() => {this.setNewTab("AddUser")}}>Add User</Button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminAddUser/>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button id="createButton" onClick={() => {this.setNewTab("Users")}}>Create User</Button>
                            <Button onClick={() => {this.setNewTab("Users")}}>Cancel</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Courses" &&
                    <div className='container'>
                        <AdminViewCourses/>
                        <div className='d-flex justify-content-end'>
                            <Button className='mt-3 mb-3' onClick={() => {this.setNewTab("AddCourse")}}>Add Course</Button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddCourse" &&
                    <div className='container'>
                        <h1 className='text-center mt-5'>Add Courses</h1>
                    </div>
                }
                {this.state.activeTab==="Teams" &&
                    <div className='container'>
                        <h1 className='text-center mt-5'>Teams</h1>
                    </div>
                }
                {this.state.activeTab==="Assessment Tasks" &&
                <>
                    <AdminViewAssessmentTask/>
                </>
                }
            </>
      )
    }
}