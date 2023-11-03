// Primary file for nagivating around the program
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/View/ViewUsers/AdminViewUsers';
import AdminViewCourses from '../Admin/View/ViewCourses/AdminViewCourses';
import RosterDashboard from '../Admin/View/ViewDashboard/RosterDashboard';
import AssessmentDashboard from '../Admin/View/ViewDashboard/AssessmentDashboard';
import AdminViewCompleteAssessmentTasks from '../Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks';
import AdminAddAssessmentTask from '../Admin/Add/AddTask/AdminAddAssessmentTask';
import CompleteAssessmentTask from '../Admin/View/CompleteAssessmentTask/CompleteAssessmentTask';
import AdminViewTeamMembers from '../Admin/View/ViewTeamMembers/AdminViewTeamMembers';
import AdminBulkUpload  from '../Admin/Add/AddUsers/AdminStudentBulkUpload';
import AdminViewConsent from '../Admin/View/ViewConsent/AdminViewConsent';
import books from '../Navbar/NavbarImages/books.png';
import user from '../Navbar/NavbarImages/user.png';
import teamIcon from '../Navbar/NavbarImages/teamIcon.png';
import form from '../Navbar/NavbarImages/form.png';
import StudentDashboard from '../Student/StudentDashboard'
import StudentTeamMembers from '../Student/View/Team/StudentTeamMembers';
import AdminTeamBulkUpload from '../Admin/Add/AddTeam/AdminTeamBulkUpload';
import AdminEditTeam from '../Admin/Add/AddTeam/AdminEditTeam'
import Logout from '../Logout/Logout';
import TeamDashboard from '../Admin/View/ViewDashboard/TeamDashboard';
import AdminAddTeam from '../Admin/Add/AddTeam/AdminAddTeam';

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: this.props.role_id === 2 ? "SuperAdminUsers" : "Courses",
            user: null,
            addUser: true,
            course: null,
            addCourse: true,
            assessment_task: null,
            addAssessmentTask: true,
            chosen_assessment_task: null,
            chosen_complete_assessment_task: null,
            team: null,
            addTeam: true,
            teams: null,
            users: null,
            chosenCourse: null,
            role_names: null,
            rubric_names: null,
            user_consent: null
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
            if (tab==="Users") {
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
        this.setAddAssessmentTaskTabWithAssessmentTask = (assessment_tasks, assessment_task_id, course, role_names, rubric_names) => {
            var newAssessmentTask = null;
            for(var a = 0; a < assessment_tasks.length; a++) {
                if(assessment_tasks[a]["assessment_task_id"]===assessment_task_id) {
                    newAssessmentTask = assessment_tasks[a];
                }
            }
            this.setState({
                activeTab: "AddTask",
                course: course,
                assessment_task: newAssessmentTask,
                addAssessmentTask: false,
                role_names: role_names,
                rubric_names: rubric_names
            });
        }
        this.setCompleteAssessmentTaskTabWithID = (assessment_tasks, assessment_task_id) => {
            var newAssessmentTask = null;
            for(var a = 0; a < assessment_tasks.length; a++) {
                if(assessment_tasks[a]["assessment_task_id"]===assessment_task_id) {
                    newAssessmentTask = assessment_tasks[a];
                }
            }
            this.setState({
                activeTab: "ViewComplete",
                chosen_assessment_task: newAssessmentTask
            });
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

        // The ===null section of the next line is not permanent. 
        // The only purpose was to test to see if we could see the "My Assessment Task" on the student dashboard
        // When you click "complete" on the "TO DO" column the completed fields were null thus it would not display anything
        // By adding ===null as a test case, we were able to have it populate.
        this.setViewCompleteAssessmentTaskTabWithAssessmentTask = (completed_assessment_tasks, completed_assessment_id, chosen_assessment_task) => {
            if(completed_assessment_tasks===null && completed_assessment_id===null && chosen_assessment_task === null){
                this.setState({
                    activeTab: "CompleteAssessmentTaskWrite"
                })
            } else {
                var new_completed_assessment_task = null;
                for(var c = 0; c < completed_assessment_tasks.length; c++) {
                    if(completed_assessment_tasks[c]["completed_assessment_id"]===completed_assessment_id) {
                        new_completed_assessment_task = completed_assessment_tasks[c];
                    }
                }
                this.setState({
                    activeTab: "CompleteAssessmentTaskReadOnly",
                    chosen_complete_assessment_task: new_completed_assessment_task,
                    chosen_assessment_task: chosen_assessment_task
                })
            }
            this.setEditConsentWithUser = (user_id, users) => {
            var new_user = null;
            for(var i = 0; i < users.length; i++) {
                if(users[i]["user_id"]===user_id) {
                    new_user = users[i];
                }
            }
            this.setState({
                activeTab: "EditConsent",
                user_consent: new_user
            })
        }
        }
        this.setEditConsentWithUser = (user_id, users) => {
            var new_user = null;
            for(var i = 0; i < users.length; i++) {
                if(users[i]["user_id"]===user_id) {
                    new_user = users[i];
                }
            }
            this.setState({
                activeTab: "EditConsent",
                user_consent: new_user
            });
        }
        this.setStudentDashboardWithCourse = (course_id, courses) => {
            var chosenCourse = null;
            for(var i = 0; i < courses.length; i++) {
                if(courses[i]["course_id"]===course_id) {
                    chosenCourse = courses[i];
                }
            }
            this.setState({
                activeTab: "StudentDashboard",
                chosenCourse: chosenCourse
            });
        }
    }
    // The commented out code below saves the state of the Navbar,
    // thus saving the current page the user is on and any corresponding data.
    // Until further testing has been done on the FrontEnd for bug testing,
    // the code below will remain commented out!
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
                if(document.getElementsByClassName("alert-danger")[0]===undefined) {
                    if(resource==="User") {
                        this.setState({
                            activeTab: this.props.role_id===2 ? "SuperAdminUsers" : "Users",
                            user: null,
                            addUser: true
                        });
                    } else if (resource==="UserConsent") {
                        this.setState({
                            activeTab: "ViewConsent",
                            user_consent: null
                        })
                    } else if (resource==="Course") {
                        this.setState({
                            activeTab: "Courses",
                            course: null,
                            addCourse: true
                        });
                    } else if (resource==="AssessmentTask") {
                        this.setState({
                            activeTab: "AssessmentTasks",
                            assessment_task: null,
                            addAssessmentTask: true
                        });
                    } else if (resource==="Team") {
                        this.setState({
                            activeTab: "Teams",
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
        return (
            <>
                <nav className="navbar">
                    <h1>SkillBuilder</h1>
                    <ul>
                        { 
                            (
                                this.state.activeTab!=="StudentDashboard" &&
                                this.state.activeTab!=="StudentTeamMembers" &&
                                this.state.activeTab!=="CompleteAssessmentTaskWrite" &&
                                this.state.chosenCourse
                            ) &&
                            <>
                                <button
                                    id="coursesNavbarTab"
                                    className="btn"
                                    style={{
                                        backgroundColor: ((
                                            this.state.activeTab==="Courses" ||
                                            this.state.activeTab==="AddCourse"
                                        ) ? "lightBlue": "")
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            activeTab: "Courses",
                                            chosenCourse: null
                                        });
                                    }}
                                >
                                    Courses
                                    <img
                                        src={books}
                                        alt=""
                                    ></img>
                                </button> 
                                <button
                                    id="usersNavbarTab"
                                    disabled={(this.state.activeTab==="Courses" || this.state.activeTab==="StudentDashboard") ? true:false}
                                    className="btn"
                                    style={{
                                        backgroundColor: ((
                                            this.state.activeTab==="Users" ||
                                            this.state.activeTab==="AddUser" ||
                                            this.state.activeTab==="BulkUpload" ||
                                            this.state.activeTab==="ViewConsent"
                                        ) ? "lightBlue": "")
                                    }}
                                    onClick={() => {
                                        this.setNewTab("Users");
                                    }}
                                >
                                    Roster
                                    <img
                                        src={user}
                                        alt=""
                                    >
                                    </img>
                                </button>
                                
                                <button
                                    id="adminTeamButton"
                                    className="btn"
                                    disabled={(this.state.activeTab==="Courses" || this.state.activeTab==="StudentDashboard") ? true:false}
                                    style={{
                                        backgroundColor: ((
                                            this.state.activeTab==="Teams" ||
                                            this.state.activeTab==="AddTeam" ||
                                            this.state.activeTab==="TeamMembers" ||
                                            this.state.activeTab==="AdminTeamBulkUpload" ||
                                            this.state.activeTab==="AdminEditTeam"
                                        ) ? "lightBlue": "")
                                    }}
                                    onClick={() => {
                                        this.setNewTab("Teams")
                                    }}
                                >
                                    Teams
                                    <img
                                        src={teamIcon}
                                        alt=""
                                    >
                                    </img>
                                </button>
                                <button
                                    className="btn"
                                    disabled={(this.state.activeTab==="Courses" || this.state.activeTab==="StudentDashboard") ? true:false}
                                    style={{
                                        backgroundColor: ((
                                            this.state.activeTab==="AssessmentTasks" ||
                                            this.state.activeTab==="AddTask" ||
                                            this.state.activeTab==="ViewComplete" ||
                                            this.state.activeTab==="CompleteAssessmentTaskReadOnly"
                                            ) ? "lightBlue": "")
                                    }}
                                    onClick={() => {
                                        this.setNewTab("AssessmentTasks");
                                    }}
                                >
                                    Assessment Tasks
                                    <img
                                        src={form}
                                        alt=""
                                    >
                                    </img>
                                </button>
                            </>
                        }
                        <Logout/>
                    </ul>
                </nav>
                
                {/*
                    The "this.state.activeTab" state variable is used to determine what should be
                    displayed on a per tab basis. Any create, save, clear, and cancel buttons are
                    found in these sections. If an additional page needs to be created, it will be
                    imported at the beginning of this file.
                */}
                {this.state.activeTab==="SuperAdminUsers" &&
                    <>
                        <div className='container'>
                            <h1 className='mt-5'>Users</h1>
                            <AdminViewUsers
                                navbar={this}
                                user={this.state.user}
                                addUser={null}
                                chosenCourse={null}
                                role_id={this.props.role_id}
                            />
                            <div className="d-flex justify-content-end gap-3">
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.setNewTab("AddUser");
                                    }}
                                    >
                                    Add User
                                </button>
                            </div>
                        </div>
                    </>
                }
                {this.state.activeTab==="Users" &&
                    <>
                        <RosterDashboard
                            navbar={this}
                            chosenCourse={this.state.chosenCourse}
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
                                Courses
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="BulkUpload" &&
                    <>
                        <div className="container" onSubmit={this.onFormSubmit}>
                            <AdminBulkUpload
                                navbar={this}
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                id="bulkUploadCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Users"
                                    })
                                }}
                            >Cancel</Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminViewUsers
                            navbar={this}
                            user={this.state.user}
                            addUser={this.state.addUser}
                            chosenCourse={this.state.chosenCourse}
                            role_id={this.props.role_id}
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
                                        activeTab: this.props.role_id===2 ? "SuperAdminUsers": "Users",
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
                {this.state.activeTab==="Courses" &&
                    <>
                        <div className='container'>
                            <AdminViewCourses
                                navbar={this}
                                course={null}
                                addCourse={null}
                                role_id={this.props.role_id}
                            />
                            { this.props.role_id === 3 &&
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
                            }
                        </div>
                    </>
                }
                {this.state.activeTab==="AddCourse" &&
                    <>
                        <AdminViewCourses
                            navbar={this}
                            course={this.state.course}
                            addCourse={this.state.addCourse}
                            role_id={this.props.role_id}
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
                                    var listOfElementsToClear = [
                                        "courseName",
                                        "courseNumber",
                                        "term",
                                        "year",
                                        "active",
                                        "useFixedTeams",
                                    ];
                                    if(document.getElementById("use_tas")) {
                                        listOfElementsToClear = [...listOfElementsToClear, "use_tas"];
                                    }
                                    Reset(listOfElementsToClear);
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
                            navbar={this}
                            chosenCourse={this.state.chosenCourse}
                            assessment_task={this.state.assessment_task}
                            addAssessmentTask={this.state.addAssessmentTask}
                            role_names={this.state.role_names}
                            rubric_names={this.state.rubric_names}
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
                                        activeTab: "AssessmentTasks",
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
                {this.state.activeTab === "AdminTeamBulkUpload"  &&
                    <>
                        <div className="container" onSubmit={this.onFormSubmit}>
                            <AdminTeamBulkUpload
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                id="TeamBulkCancel"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Teams"
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddTeam" &&
                    <>
                        <div className='container'>
                            <AdminAddTeam
                                navbar={this}
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
                                        activeTab: "Teams",
                                        team: null,
                                        addTeam: true,
                                        users: null
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
                {this.state.activeTab==="Teams" &&
                    <>
                        <div className='container'>
                            <TeamDashboard
                                navbar={this}
                                chosenCourse={this.state.chosenCourse}
                            />
                        </div>
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
                                Courses
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="StudentDashboard" &&
                    <>
                        <StudentDashboard
                            navbar={this}
                            chosenCourse={this.state.chosenCourse}
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
                                Courses
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="TeamMembers" &&
                    <>
                        <div className='container'>
                            <AdminViewTeamMembers
                                navbar={this}
                                team={this.state.team}
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                id="viewTeamMembers"
                                    style={{
                                        backgroundColor: "black",
                                        color:"white",
                                        margin: "10px 5px 5px 0"
                                    }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Teams",
                                        team: null,
                                        addTeam: true
                                    });
                                }}
                            >
                                Teams
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="StudentTeamMembers" &&
                    <>
                        <div className='container'>
                            <StudentTeamMembers
                                team={this.state.team}
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "StudentDashboard"
                                    });
                                }}
                            >
                                Student Dashboard
                            </Button>
                        </div>
                        
                    </>
                }
                {this.state.activeTab==="AssessmentTasks" &&
                    <>
                        <AssessmentDashboard
                            navbar={this}
                            chosenCourse={this.state.chosenCourse}
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
                                Courses
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="ViewComplete" &&
                    <>
                        <div className='container'>
                            <AdminViewCompleteAssessmentTasks
                                navbar={this}
                                chosenCourse={this.state.chosenCourse}
                                chosen_assessment_task={this.state.chosen_assessment_task}
                            />
                            <Button
                                id="viewCompleteAssessmentTasks"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setNewTab("AssessmentTasks");
                                }}
                                >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="CompleteAssessmentTaskReadOnly" &&
                    <>
                        <div className='container'>
                            <CompleteAssessmentTask
                                navbar={this}
                                chosen_assessment_task={this.state.chosen_assessment_task}
                                chosen_complete_assessment_task={this.state.chosen_complete_assessment_task}
                                readOnly={true}
                                // readOnly={false}
                            />
                            <Button
                                id="viewCompleteAssessmentTasks"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "ViewComplete",
                                        chosen_complete_assessment_task: null
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {/* {this.state.activeTab==="CompleteAssessmentTaskWrite" &&
                    <>
                        <div className='container'>
                            <CompleteAssessmentTask
                                chosen_assessment_task={null}
                                chosen_complete_assessment_task={null}
                                readOnly={false}
                            />
                            <Button
                                id="viewCompleteAssessmentTasks"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "StudentDashboard",
                                        chosen_complete_assessment_task: null
                                    });
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                } */}
                {this.state.activeTab==="ViewConsent" &&
                    <>
                        <div className='container'>
                            <AdminViewConsent
                                navbar={this}
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                id="viewConsent"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "Users",
                                        
                                    });
                                }}
                            >
                                Back
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AdminEditTeam" &&
                    <>
                        <div className='container'>
                            <AdminEditTeam
                                navbar={this}
                                team={this.state.team}
                                chosenCourse={this.state.chosenCourse}
                            />
                            <Button
                                id="cancelEditTeam"
                                style={{
                                    backgroundColor: "black",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    this.setState({
                                        activeTab: "TeamMembers",
                                        
                                    });
                                }}
                            >
                                Back
                            </Button>
                            
                        </div>
                    </>
                }
            </>
        )
    }
}