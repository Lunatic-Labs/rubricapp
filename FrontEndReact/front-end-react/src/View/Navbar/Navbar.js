import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/ViewUsers/AdminViewUsers';
import AdminAddUser from '../Admin/AddUsers/AdminAddUser';
import AdminViewCourses from '../Admin/ViewCourses/AdminViewCourses';
import AdminViewAssessmentTask from '../Admin/ViewAssessmentTask/AdminViewAssessmentTask';

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
                        <button className="btn" style={{backgroundColor: ((this.state.activeTab==="Users" || this.state.activeTab==="AddUser") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Users")}}>Users</button>
                        <button className="btn" style={{backgroundColor: ((this.state.activeTab==="Courses" || this.state.activeTab==="AddCourse") ? "lightBlue": "")}} onClick={() => {this.setNewTab("Courses")}}>Courses</button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Teams" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Teams")}}>Teams</button>
                        <button className="btn" style={{backgroundColor: (this.state.activeTab==="Assessment Tasks" ? "lightBlue": "")}} onClick={() => {this.setNewTab("Assessment Tasks")}}>Assessment Tasks</button>
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
                            <Button id="createButton">Create User</Button>
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
                    <h1 className='text-center'>Add Courses</h1>
                }
                {this.state.activeTab==="Teams" && <h1 className='text-center'>Teams</h1>}
                {this.state.activeTab==="Assessment Tasks" &&
                <>
                    <AdminViewAssessmentTask/>
                </>
                }
            </>
      )
    }
}