import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/View/ViewUsers/AdminViewUsers';
import AdminViewCourses from '../Admin/View/ViewCourses/AdminViewCourses';
import AdminViewDashboard from '../Admin/View/ViewDashboard/AdminViewDashboard';
import AdminViewCompleteAssessmentTasks from '../Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks';
import AdminAddAssessmentTask from '../Admin/Add/AddTask/AdminAddAssessmentTask';
import CompleteAssessmentTask from '../Admin/View/CompleteAssessmentTask/CompleteAssessmentTask';
import AdminViewTeamMembers from '../Admin/View/ViewTeamMembers/AdminViewTeamMembers';
import AdminViewTeams from '../Admin/View/ViewTeams/AdminViewTeams';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "Courses",
            user: null,
            addUser: true,
            course: null,
            addCourse: true,
            assessment_task: null,
            addAssessmentTask: true,
            complete_assessment_task: null,
            team: null,
            addTeam: true,
            users: null,
            chosenCourse: null
        }
        this.setNewTab = (newTab) => {
            this.setState({
                activeTab: newTab
            });
        }
        this.setAddUserTabWithUser = (users, user_id) => {
            var newUser = null;
            for(var u = 0; u < users.length; u++) {
                if(users[u]["user_id"]===user_id) {
                    newUser = users[u];
                }
            }
            this.setState({
                activeTab: "AddUser",
                user: newUser,
                addUser: false
            });
        }
        this.setAddCourseTabWithCourse = (courses, course_id, tab) => {
            var newCourse = null;
            for(var c = 0; c < courses.length; c++) {
                if(courses[c]["course_id"]===course_id) {
                    newCourse = courses[c];
                }
            }
            if (tab==="AdminDashboard") {
                this.setState({
                    activeTab: tab,
                    chosenCourse: newCourse
                })
            } else {
                this.setState({
                    activeTab: tab,
                    course: newCourse,
                    addCourse: false
                });
            }
        }
        this.setAddAssessmentTaskTabWithAssessmentTask = (assessment_tasks, assessment_task_id, course) => {
            var newAssessmentTask = null;
            for(var a = 0; a < assessment_tasks.length; a++) {
                if(assessment_tasks[a]["at_id"]===assessment_task_id) {
                    newAssessmentTask = assessment_tasks[a];
                }
            }
            this.setState({
                activeTab: "AddTask",
                course: course,
                assessment_task: newAssessmentTask,
                addAssessmentTask: false
            });
        }
        this.setCompleteAssessmentTaskTabWithID = (assessment_tasks, at_id) => {
            var newAssessmentTask = null;
            for(var a = 0; a < assessment_tasks.length; a++) {
                if(assessment_tasks[a]["at_id"]===at_id) {
                    newAssessmentTask = assessment_tasks[a];
                }
            }
            this.setState({activeTab: "Complete Assessment Task", complete_assessment_task: newAssessmentTask});
        }
        this.setAddTeamTabWithTeam = (teams, team_id, users, tab) => {
            var newTeam = null;
            for(var t = 0; t < teams.length; t++) {
                if(teams[t]["team_id"]===team_id) {
                    newTeam = teams[t];
                }
            }
            this.setState({
                activeTab: tab,
                team: newTeam,
                addTeam: false,
                users: users,
            });
        }
        this.setAddTeamTabWithUsers = (users) => {
            this.setState({
                activeTab: "AddTeam",
                users: users
            })
        }
    }
    // componentDidMount() {
    //     const data = window.localStorage.getItem('SKILBUILDER_STATE_NAVBAR_DATA');
    //     if (data !== null) this.setState(JSON.parse(data));
    // }
    // componentDidUpdate() {
    //     window.localStorage.setItem('SKILBUILDER_STATE_NAVBAR_DATA', JSON.stringify(this.state));
    // }
    render() {
        const confirmCreateResource = (resource) => {
            setTimeout(() => {
                if(document.getElementsByClassName("text-danger")[0]===undefined) {
                    if(resource==="User") {
                        this.setState({
                            activeTab: "AdminDashboard",
                            user: null,
                            addUser: true
                        });
                    } else if (resource==="Course") {
                        this.setState({
                            activeTab: "Courses",
                            course: null,
                            addCourse: true
                        });
                    } else if (resource==="AssessmentTask") {
                        this.setState({
                            activeTab: "AdminDashboard",
                            assessment_task: null,
                            addAssessmentTask: true
                        });
                    } else if (resource==="Team") {
                        this.setState({
                            activeTab: "AdminDashboard",
                            team: null,
                            addTeam: true
                        });
                    }
                }
            }, 1000);
        }
        const Reset = (listOfElements) => {
            for(var element = 0; element < listOfElements.length; element++) {
                document.getElementById(listOfElements[element]).value = "";
                if(document.getElementById(listOfElements[element]).getAttribute("type")==="checkbox") {
                    document.getElementById(listOfElements[element]).checked = false;
                }
            }
        }
        // const loggedInUser = this.props.user;
        // console.log(loggedInUser);
        return (
            <>
                <nav className="navbar">
                    <h1>SkillBuilder</h1>
                    <ul>
                        {/* <button
                            id="usersNavbarTab"
                            className="btn"
                            style={{
                                backgroundColor: ((this.state.activeTab==="Users" || this.state.activeTab==="AddUser") ? "lightBlue": "")
                            }}
                            onClick={() => {
                                this.setNewTab("Users");
                            }}
                        >
                            Users
                            <img
                                src={user}
                                alt=""
                            ></img>
                        </button> */}
                        {/* <button
                            id="coursesNavbarTab"
                            className="btn"
                            style={{
                                backgroundColor: ((
                                    this.state.activeTab==="Courses" ||
                                    this.state.activeTab==="AddCourse" ||
                                    this.state.activeTab==="AdminDashboard" ||
                                    this.state.activeTab==="AddTask" ||
                                    this.state.activeTab==="Complete Assessment Task"
                                ) ? "lightBlue": "")
                            }}
                            onClick={() => {
                                this.setNewTab("Courses");
                            }}
                        >
                            Courses
                            <img
                                src={books}
                                alt=""
                            ></img>
                        </button> */}
                        {/* <button
                            className="btn"
                            style={{
                                backgroundColor: (this.state.activeTab==="Teams" ? "lightBlue": "")
                            }}
                            onClick={() => {
                                this.setNewTab("Teams")
                            }}
                        >
                            Teams
                            <img
                                src={teamIcon}
                                alt=""
                            ></img>
                        </button> */}
                        {/* <button
                            className="btn"
                            style={{
                                backgroundColor: (this.state.activeTab==="Complete Assessment Task" ? "lightBlue": "")
                            }}
                            onClick={() => {
                                this.setNewTab("Complete Assessment Task");
                            }}
                        >
                            Complete Assessment Task
                            <img
                                src={form}
                                alt=""
                            ></img>
                        </button> */}
                    </ul>
                </nav>
                {this.state.activeTab==="Users" &&
                    <div className='container'>
                        <AdminViewUsers
                            user={null}
                            addUser={null}
                            setAddUserTabWithUser={this.setAddUserTabWithUser}
                            setNewTab={this.setNewTab}
                        />
                        <div className="d-flex justify-content-end">
                            {/* <Button
                                className='mt-3 mb-3'
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setNewTab("AddUser")
                                }}
                            >Add User</Button> */}
                            <button
                                // className='mt-3 mb-3'
                                className='mt-3 mb-3 btn btn-primary'
                                // style={{
                                //     backgroundColor: "#2E8BEF",
                                //     color:"white",
                                //     margin: "10px 5px 5px 0"
                                // }}
                                onClick={() => {
                                    this.setNewTab("AddUser")
                                }}
                            >
                                Add User
                            </button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminViewUsers
                            user={this.state.user}
                            addUser={this.state.addUser}
                            chosenCourse={this.state.chosenCourse}
                            setAddUserTabWithUser={this.setAddUserTabWithUser}
                            setNewTab={this.setNewTab}
                        />
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button
                                id="createUser"
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    // console.log("Create User!");
                                    // console.log(this.state.chosenCourse);
                                    // console.log("__________________");
                                    confirmCreateResource("User");
                                }}
                            >
                                Create User
                            </Button>
                            <Button
                                id="createUserCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        // activeTab: "Users",
                                        activeTab: "AdminDashboard",
                                        user: null,
                                        addUser: true
                                    })
                                }}
                                >Cancel</Button>
                            <Button
                                id="createUserClear"
                                style={{
                                    backgroundColor: "grey",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    Reset([
                                        "firstName",
                                        "lastName",
                                        "email",
                                        "password",
                                        "role",
                                        "lms_id"
                                    ]);
                                }}
                            >Clear</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AdminDashboard" &&
                    <>
                        <AdminViewDashboard
                            chosenCourse={this.state.chosenCourse}
                            setNewTab={this.setNewTab}
                            setAddUserTabWithUser={this.setAddUserTabWithUser}
                            setAddAssessmentTaskTabWithAssessmentTask={this.setAddAssessmentTaskTabWithAssessmentTask}
                            setCompleteAssessmentTaskTabWithID={this.setCompleteAssessmentTaskTabWithID}
                            setAddTeamTabWithTeam={this.setAddTeamTabWithTeam}
                            setAddTeamTabWithUsers={this.setAddTeamTabWithUsers}
                        />
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Courses",
                                        chosenCourse: null
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Courses" &&
                    <div className='container'>
                        <AdminViewCourses
                            course={null}
                            addCourse={null}
                            // User here is the logged in user, currently is hard codded SuperAdmin!
                            user={{"user_id": 1}}
                            setAddCourseTabWithCourse={this.setAddCourseTabWithCourse}
                            setNewTab={this.setNewTab}
                        />
                        <div className='d-flex justify-content-end'>
                            <button
                                className='mt-3 mb-3 btn btn-primary'
                                onClick={() => {
                                    this.setNewTab("AddCourse");
                                }}
                            >
                                Add Course
                            </button>
                        </div>
                    </div>
                }
                {this.state.activeTab==="AddCourse" &&
                    <>
                        <AdminViewCourses
                            course={this.state.course}
                            addCourse={this.state.addCourse}
                            setAddCourseTabWithCourse={this.setAddCourseTabWithCourse}
                            setNewTab={this.setNewTab}
                            // User here is the logged in user, currently is hard codded SuperAdmin!
                            user={{"user_id": 1}}
                        />
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button
                                id="createCourse"
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    confirmCreateResource("Course");
                                }}
                            >
                                Create Course
                            </Button>
                            <Button
                                id="createCourseCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Courses",
                                        course: null,
                                        addCourse: true
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                id="createCourseClear"
                                style={{
                                    backgroundColor: "grey",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    Reset([
                                        "courseName",
                                        "courseNumber",
                                        "term",
                                        "year",
                                        "active",
                                        "admin_id",
                                        "use_tas",
                                    ]);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddTask" &&
                    <>
                        <AdminAddAssessmentTask
                            chosenCourse={this.state.chosenCourse}
                            assessment_task={this.state.assessment_task}
                            addAssessmentTask={this.state.addAssessmentTask}
                            setAddAssessmentTaskTabWithAssessmentTask={this.state.setAddAssessmentTaskTabWithAssessmentTask}
                            setNewTab={this.setNewTab}
                        />
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button
                                id="createAssessmentTask"
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    confirmCreateResource("AssessmentTask");
                                }}
                            >
                                Create Task
                            </Button>
                            <Button
                                id="createAssessmentTaskCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "AdminDashboard",
                                        assessment_task: null,
                                        addAssessmentTask: true
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                id="createAssessmentTaskClear"
                                style={{
                                    backgroundColor: "grey",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    Reset([
                                        "assessmentTaskName",
                                        "dueDate",
                                        "roleID",
                                        "rubricID",
                                        "suggestions"
                                    ]);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </>
                }
                { this.state.activeTab==="AddTeam" &&
                    <>
                        <div className='container'>
                            <AdminViewTeams
                                show={"AddTeam"}
                                team={this.state.team}
                                addTeam={this.state.addTeam}
                                users={this.state.users}
                                chosenCourse={this.state.chosenCourse}
                            />
                        </div>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                            <Button
                                id="createTeam"
                                style={{
                                    backgroundColor: "#2E8BEF",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    confirmCreateResource("Team");
                                }}
                            >
                                Add Team
                            </Button>
                            <Button
                                id="createTeamCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "AdminDashboard",
                                        team: null,
                                        addTeam: true
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                id="createTeamClear"
                                style={{
                                    backgroundColor: "grey",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    if(this.state.chosenCourse["use_tas"]) {
                                        Reset([
                                            "teamName",
                                            "observerID"
                                        ]);
                                    } else {
                                        Reset([
                                            "teamName"
                                        ]);
                                    }
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </>
                }
                { this.state.activeTab==="TeamMembers" &&
                    <>
                        <div className='container'>
                            <AdminViewTeamMembers
                                team={this.state.team}
                                course={this.state.course}
                            />
                            <Button
                                id="viewTeamMembers"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setNewTab("AdminDashboard");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Complete Assessment Task" &&
                    <>
                        <CompleteAssessmentTask
                            complete_assessment_task={this.state.complete_assessment_task}
                            setNewTab={this.setNewTab}
                        />
                    </>
                }
                {this.state.activeTab==="ViewComplete" &&
                    <>
                        <div className='container'>
                            <AdminViewCompleteAssessmentTasks/>
                            <Button
                                id="viewCompleteAssessmentTasks"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setNewTab("AdminDashboard");
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
            </>
        )
    }
}