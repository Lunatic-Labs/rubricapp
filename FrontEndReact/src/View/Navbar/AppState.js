// Primary file for nagivating around the program
import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/View/ViewUsers/AdminViewUsers';
import AdminViewCourses from '../Admin/View/ViewCourses/AdminViewCourses';
import TeamDashboard from '../Admin/View/ViewDashboard/TeamDashboard';
import RosterDashboard from '../Admin/View/ViewDashboard/RosterDashboard';
import AssessmentDashboard from '../Admin/View/ViewDashboard/AssessmentDashboard';
import AdminViewCompleteAssessmentTasks from '../Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks';
import AdminAddAssessmentTask from '../Admin/Add/AddTask/AdminAddAssessmentTask';
import CompleteAssessmentTask from '../Admin/View/CompleteAssessmentTask/CompleteAssessmentTask';
import AdminViewTeamMembers from '../Admin/View/ViewTeamMembers/AdminViewTeamMembers';
import AdminViewTeams from '../Admin/View/ViewTeams/AdminViewTeams';
import AdminBulkUpload  from '../Admin/Add/AddUsers/AdminStudentBulkUpload';
import AdminViewConsent from '../Admin/View/ViewConsent/AdminViewConsent';
import StudentDashboard from '../Student/StudentDashboard'
import StudentTeamMembers from '../Student/View/Team/StudentTeamMembers';
import AdminTeamBulkUpload from '../Admin/Add/AddTeam/AdminTeamBulkUpload';
import AdminEditTeam from '../Admin/Add/AddTeam/AdminEditTeam';
import StudentManageCurrentTeam from '../Student/View/ManageTeam/StudentManageCurrentTeam';
import StudentBuildTeam from '../Student/View/BuildTeam/StudentBuildTeam';
import ButtonAppBar from './Navbar';
import Box from '@mui/material/Box';
import ArrowBackIos from '@mui/icons-material/ArrowBack';
import { Typography } from '@mui/material';
import BackButtonResource from '../Components/BackButtonResource';
import AdminImportAssessmentTasks from '../Admin/Add/ImportTasks/AdminImportAssessmentTasks';

export default class AppState extends Component {
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
            chosen_assessment_task: null,
            chosen_complete_assessment_task: null,
            team: null,
            addTeam: true,
            users: null,
            chosenCourse: null,
            role_names: null,
            rubric_names: null,
            user_consent: null,
            // user_id logged in
            user_id: 2
        }
        this.setNewTab = (newTab) => {
            this.setState({
                activeTab: newTab
            });
        }
        this.setAddUserTabWithUser = (users, user_id) => {
            if(users === null && user_id===null) {
                this.setState({
                    activeTab: "AddUser",
                    user: null,
                    addUser: false
                });
            } else {
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
            } else if (tab==="AddCourse" && courses.length===0 && course_id===null) {
                this.setState({
                    activeTab: tab,
                    course: null,
                    addCourse: null
                });
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
            this.adminViewTeams = {};
            this.adminViewTeams.show = "AddTeam";
            this.setState({
                activeTab: tab,
                team: newTeam,
                addTeam: false,
                users: users,
            });
        }
        this.setAddTeamTabWithUsers = (users) => {
            this.adminViewTeams = {};
            this.adminViewTeams.show = "AddTeam";
            this.setState({
                activeTab: "AddTeam",
                users: users
            });
        }
        this.setConfirmResource = (tab) => {
            this.setState({
                activeTab: tab,
                course: null,
                addCourse: true                 
            })
        }
        // The ===null section of the next line is not permanent. 
        // The only purpose was to test to see if we could see the "My Assessment Task" on the student dashboard
        // When you click "complete" on the "TO DO" column the completed fields were null thus it would not display anything
        // By adding ===null as a test case, we were able to have it populate.
        this.setViewCompleteAssessmentTaskTabWithAssessmentTask = (completed_assessment_tasks, completed_assessment_id, chosen_assessment_task) => {
            if(completed_assessment_tasks===null && completed_assessment_id===null && chosen_assessment_task === null){
                /* TODO: Temporarly hard coded chosen_assessment_task, chosen_complete_assessment_task, and readOnly! */
                this.setState({
                    activeTab: "CompleteAssessmentTaskWrite",
                    chosen_assessment_task: null,
                    chosen_complete_assessment_task: null,
                    readOnly: false
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
        this.confirmCreateResource = (resource) => {
            setTimeout(() => {
                if(document.getElementsByClassName("alert-danger")[0]===undefined) {
                    if(resource==="User") {
                        this.setState({
                            activeTab: "Users",
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
        const Reset = (listOfElements) => {
            for(var element = 0; element < listOfElements.length; element++) {
                document.getElementById(listOfElements[element]).value = "";
                if(document.getElementById(listOfElements[element]).getAttribute("type")==="checkbox") {
                    document.getElementById(listOfElements[element]).checked = false;
                }
            }
        }
        
        return (
            <Box className="app-body">
                <ButtonAppBar/>
                {/* Moved the Tab Component to its children level.  */}
                {/*
                    The "this.state.activeTab" state variable is used to determine what should be
                    displayed on a per tab basis. Any create, save, clear, and cancel buttons are
                    found in these sections. If an additional page needs to be created, it will be
                    imported at the beginning of this file.
                */}
                
                {this.state.activeTab==="Users" &&
                    <>
                        <RosterDashboard
                            navbar={this}
                        />
                    </>
                }
                {this.state.activeTab==="BulkUpload" &&
                    <>
                        <div className="container" onSubmit={this.onFormSubmit}>
                            <AdminBulkUpload
                                navbar={this.state}
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
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddUser" &&
                    <>
                        <AdminViewUsers
                            navbar={this}
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
                                    this.confirmCreateResource("User");
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
                                        activeTab: "Users",
                                        user: null,
                                        addUser: true
                                    })
                                }}
                            >
                                Cancel
                            </Button>
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
                            >
                                Clear
                            </Button>
                        </div>
                    </>
                }
                {this.state.activeTab==="Courses" &&
                    <>
                        <Box sx={{display:'flex', flexDirection:'column'}}>
                            <AdminViewCourses
                                navbar={this}
                            />
                        </Box>
                    </>
                }
                {this.state.activeTab==="AddCourse" &&
                    <>
                        <Box className="page-spacing">
                            <BackButtonResource
                                confirmResource={this.confirmCreateResource}
                                tabSelected={"Course"}
                            />
                            <AdminViewCourses
                                navbar={this}
                            />
                        </Box>
                    </>
                }
                {this.state.activeTab==="BuildNewTeam" &&
                  // NOTE: SKIL-161
                    <>
                        {/* TODO from Brian: Implement BackComponent here! */}
                        <div style={{ backgroundColor: '#F8F8F8' }}>
                            <div>
                                <Button
                                    variant='filledTonal'
                                    size='small'
                                    onClick={() => {
                                        this.setState({
                                            activeTab: "Courses"
                                        })
                                    }}
                                    style={{
                                        backgroundColor:'#dcdcdc',
                                        position:'absolute',
                                        borderRadius: '21px',
                                        top: '80px',
                                        left: '32px'
                                    }}
                                >
                                    <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
                                    <Typography variant='body2'
                                        style={{ fontSize: '12px' }}
                                    >
                                        Back
                                    </Typography>
                                </Button>
                            </div>
                            <StudentBuildTeam
                                navbar={this}
                            />
                        </div>
                    </>
                }
                {this.state.activeTab==="ManageCurrentTeam" &&
                // NOTE: SKIL-161
                // Handles the button and view for SelectTeamMembers View
                    <>
                        {/* TODO from Brian: Implement BackComponent here! */}
                        <div style={{ backgroundColor: '#F8F8F8' }}>
                            <div >
                                <Button
                                    variant='filledTonal'
                                    size='small'
                                    onClick={() => {
                                        this.setState({
                                            activeTab: "Courses",
                                        })
                                    }}
                                    style={{
                                        backgroundColor:'#dcdcdc',
                                        position:'absolute',
                                        borderRadius: '21px',
                                        top: '80px',
                                        left: '32px'
                                    }}
                                    >
                                    <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
                                    <Typography variant='body2'
                                        style={{ fontSize: '12px' }}
                                    >
                                        Back
                                    </Typography>
                                </Button>
                            </div>
                            <StudentManageCurrentTeam
                                navbar={this}
                            />
                        </div>
                    </>
                }
                {this.state.activeTab==="CodeRequirement" &&
                    <>
                        <div className='container'>
                            <div>
                                <Button
                                    variant='filledTonal'
                                    size='small'
                                    onClick={() => {
                                        this.setState({
                                            activeTab: "",
                                        })
                                    }}
                                    style={{
                                        backgroundColor:'#dcdcdc',
                                        position:'absolute',
                                        borderRadius: '21px',
                                        top: '80px',
                                        left: '10px'
                                    }}
                                >
                                    <ArrowBackIos style={{ fontSize: 12, color: '#2E8BEF' }}/>
                                    <Typography
                                        variant='body2'
                                        style={{ fontSize: '12px' }}
                                    >
                                        Back
                                    </Typography>
                                </Button>
                            </div>
                        </div>
                    </>
                }
                {this.state.activeTab==="AddTask" &&
                    <>
                        <AdminAddAssessmentTask
                            navbar={this}
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
                                    this.confirmCreateResource("AssessmentTask");
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
                                navbar={this}
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
                            <AdminViewTeams
                                navbar={this}
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
                                    this.confirmCreateResource("Team");
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
                        <TeamDashboard
                            navbar={this}
                        />
                    </>
                }
                {this.state.activeTab==="StudentDashboard" &&
                    <>
                        <StudentDashboard
                            navbar={this}
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
                                navbar={this}
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
                        />
                    </>
                }
                {this.state.activeTab==="ImportAssessmentTasks" &&
                    <>
                        <AdminImportAssessmentTasks
                            navbar={this}
                        />
                        <div className='d-flex justify-content-center'>
                            <div className='d-flex justify-content-center gap-3 w-25 mt-2'>
                                <Button
                                    id="importAssessmentTasksCancel"
                                    className='bg-black mr-1'
                                    variant='contained' 
                                    onClick={() => {
                                        this.setNewTab('AssessmentTasks');
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    id="importAssessmentTasks"
                                    className='primary-color mr-1'
                                    variant='contained' 
                                    onClick={() => {
                                        this.confirmCreateResource('AssessmentTask');
                                    }}
                                >
                                    Import
                                </Button>
                            </div>
                        </div>
                    </>
                }
                {this.state.activeTab==="ViewComplete" &&
                    <>
                        <div className='container'>
                            <AdminViewCompleteAssessmentTasks
                                navbar={this}
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
                            {this.completeAssessmentTaskReadOnly = {}}
                            {this.completeAssessmentTaskReadOnly.readOnly = true}
                            <CompleteAssessmentTask
                                navbar={this}
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
                {this.state.activeTab==="CompleteAssessmentTaskWrite" &&
                    <>
                        <div className='container'>
                            <CompleteAssessmentTask
                                navbar={this}
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
                }
                {this.state.activeTab==="ViewConsent" &&
                    <>
                        <div className='container'>
                            <AdminViewConsent
                                navbar={this}
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
            </Box>
        )
    }
}