import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/View/ViewUsers/AdminViewUsers';
import AdminViewCourses from '../Admin/View/ViewCourses/AdminViewCourses';
import RosterDashboard from '../Admin/View/ViewDashboard/RosterDashboard';
import AssessmentDashboard from '../Admin/View/ViewDashboard/AssessmentDashboard';
import AdminViewCompleteAssessmentTasks from '../Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks';
import AdminImportAssessmentTasks from '../Admin/Add/ImportTasks/AdminImportAssessmentTasks';
import CompleteAssessmentTask from '../Admin/View/CompleteAssessmentTask/CompleteAssessmentTask';
import AdminViewTeamMembers from '../Admin/View/ViewTeamMembers/AdminViewTeamMembers';
import AdminBulkUpload  from '../Admin/Add/AddUsers/AdminBulkUpload';
import StudentDashboard from '../Student/StudentDashboard'
import StudentTeamMembers from '../Student/View/Team/StudentTeamMembers';
import AdminEditTeam from '../Admin/Add/AddTeam/AdminEditTeam'
import TeamDashboard from '../Admin/View/ViewDashboard/TeamDashboard';
import AdminAddTeam from '../Admin/Add/AddTeam/AdminAddTeam';
import AdminAddAssessmentTask from '../Admin/Add/AddTask/AdminAddAssessmentTask';
import ButtonAppBar from './Navbar';
import { Box, Typography } from '@mui/material';
import BackButtonResource from '../Components/BackButtonResource';
import StudentConfirmCurrentTeam from '../Student/View/ConfirmCurrentTeam/StudentConfirmCurrentTeam';
import StudentViewAssessmentTaskInstructions from '../Student/View/AssessmentTask/StudentViewAssessmentTaskInstructions'
import SelectTeam from '../Student/View/SelectTeam/SelectTeam';
import CodeRequirement from '../Student/View/TeamPassword/CodeRequirement';
import StudentBuildTeam from '../Student/View/BuildTeam/StudentBuildTeam';
import StudentManageCurrentTeam from '../Student/View/BuildTeam/StudentBuildTeam';

export default class AppState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: this.props.isSuperAdmin ? "SuperAdminUsers" : "Courses",

            user: null,
            addUser: null,

            course: null,
            addCourse: null,

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
            user_consent: null,

            addTeamAction: null,
        }

        this.setNewTab = (newTab) => {
            this.setState({
                activeTab: newTab
            });
        }

        this.setAddUserTabWithUser = (users, user_id) => {
            var newUser = null;

            for (var u = 0; u < users.length; u++) {
                if (users[u]["user_id"] === user_id) {
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
            if (courses.length === 0 && course_id === null && tab === "AddCourse") {
                this.setState({
                    activeTab: tab,
                    course: null,
                    addCourse: true
                });
            } else {
                var newCourse = null;

                for (var c = 0; c < courses.length; c++) {
                    if (courses[c]["course_id"] === course_id) {
                        newCourse = courses[c];
                    }
                }

                if (tab === "Users") {
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
        }

        this.setAssessmentTaskInstructions = (assessment_tasks, assessment_task_id) => { // wip
            var assessment_task = null;
            for (var index = 0; index < assessment_tasks.length; index++) {
                if (assessment_tasks[index]["assessment_task_id"] === assessment_task_id) {
                    assessment_task = assessment_tasks[index];
                }
            }
            this.setState({
                activeTab: "AssessmentTaskInstructions",
                chosen_assessment_task: assessment_task
            });
        }

        this.setConfirmCurrentTeam = (assessment_tasks, assessment_task_id, switchTeam) => {
            var assessment_task = null;
            for (var index = 0; index < assessment_tasks.length; index++) {
                if (assessment_tasks[index]["assessment_task_id"] === assessment_task_id) {
                    assessment_task = assessment_tasks[index];
                }
            }

            const tab = switchTeam ? "CodeRequired" : "ConfirmCurrentTeam"
            this.setState({
                activeTab: tab,
                chosen_assessment_task: assessment_task
            });
        }

        this.setAddAssessmentTaskTabWithAssessmentTask = (assessment_tasks, assessment_task_id, course, role_names, rubric_names) => {
            var newAssessmentTask = null;

            for (var a = 0; a < assessment_tasks.length; a++) {
                if (assessment_tasks[a]["assessment_task_id"] === assessment_task_id) {
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

            for (var a = 0; a < assessment_tasks.length; a++) {
                if (assessment_tasks[a]["assessment_task_id"] === assessment_task_id) {
                    newAssessmentTask = assessment_tasks[a];
                }
            }

            this.setState({
                activeTab: "ViewComplete",
                chosen_assessment_task: newAssessmentTask
            });
        }

        this.setAddTeamTabWithTeam = (teams, team_id, users, tab, addTeamAction) => {
            var newTeam = null;

            for (var t = 0; t < teams.length; t++) {
                if (teams[t]["team_id"] === team_id) {
                    newTeam = teams[t];
                }
            }

            this.setState({
                activeTab: tab,
                team: newTeam,
                addTeam: false,
                users: users,
                addTeamAction: addTeamAction
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
            if (completed_assessment_tasks === null && completed_assessment_id === null && chosen_assessment_task === null) {
                /* TODO: Temporarly hard coded chosen_assessment_task, chosen_complete_assessment_task, and readOnly! */
                this.completeAssessmentTaskReadOnly = {};
                this.completeAssessmentTaskReadOnly.readOnly = false;

                this.setState({
                    activeTab: "CompleteAssessment",
                    chosen_assessment_task: null,
                    chosen_complete_assessment_task: null,
                    readOnly: false
                })
            } else {
                var new_completed_assessment_task = null;

                for (var c = 0; c < completed_assessment_tasks.length; c++) {
                    if (completed_assessment_tasks[c]["completed_assessment_id"] === completed_assessment_id) {
                        new_completed_assessment_task = completed_assessment_tasks[c];
                    }
                }

                this.completeAssessmentTaskReadOnly = {};
                this.completeAssessmentTaskReadOnly.readOnly = true;

                this.setState({
                    activeTab: "CompleteAssessment",
                    chosen_complete_assessment_task: new_completed_assessment_task,
                    chosen_assessment_task: chosen_assessment_task
                })
            }
        }

        this.ViewCTwithAT = (assessment_tasks, at_id) => {
            var selectedAssessment = null;

            for(var index = 0; index < assessment_tasks.length; index++) {
                if(assessment_tasks[index]["assessment_task_id"] === at_id) {
                    selectedAssessment = assessment_tasks[index];
                }
            }

            this.setState({
                activeTab: "CompleteAssessment",
                chosen_assessment_task: selectedAssessment
            });
        };

        this.setEditConsentWithUser = (user_id, users) => {
            var new_user = null;

            for (var i = 0; i < users.length; i++) {
                if (users[i]["user_id"] === user_id) {
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

            for (var i = 0; i < courses.length; i++) {
                if (courses[i]["course_id"] === course_id) {
                    chosenCourse = courses[i];
                }
            }

            this.setState({
                activeTab: "StudentDashboard",
                chosenCourse: chosenCourse
            });
        }

        this.confirmCreateResource = (resource) => {
            setTimeout(() => {
                if (document.getElementsByClassName("alert-danger")[0] === undefined) {
                    if (resource === "User") {
                        this.setState({
                            activeTab: this.props.isSuperAdmin ? "SuperAdminUsers" : "Users",
                            user: null,
                            addUser: null
                        });
                    } else if (resource === "Course") {
                        this.setState({
                            activeTab: "Courses",
                            course: null,
                            addCourse: null
                        });
                    } else if (resource === "AssessmentTask") {
                        this.setState({
                            activeTab: "AssessmentTasks",
                            assessment_task: null,
                            addAssessmentTask: true
                        });
                    } else if (resource === "ImportAssessmentTasks") {
                        this.setState({
                            activeTab: "AssessmentTasks"
                        });
                    } else if (resource === "Team") {
                        this.setState({
                            activeTab: "Teams",
                            team: null,
                            addTeam: true
                        });
                    } else if (resource==="TeamMember") {
                        this.setState({
                            activeTab: "TeamMembers",
                            addTeamAction: null
                        });
                    } else if (resource==="CompleteTask") {
                        this.setState({
                            activeTab: "ViewComplete",
                            chosen_complete_assessment_task: null
                        });
                    } else if(resource==="StudentCompleteTask") {
                        this.setState({
                            activeTab: "StudentDashboard",
                            chosen_assessment_task: null
                        });
                    }
                }
            }, 1000);
        }

        this.Reset = (listOfElements) => {
            for (var element = 0; element < listOfElements.length; element++) {
                document.getElementById(listOfElements[element]).value = "";
                if (document.getElementById(listOfElements[element]).getAttribute("type") === "checkbox") {
                    document.getElementById(listOfElements[element]).checked = false;
                }
            }
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
        return (
            <Box className="app-body">
                <ButtonAppBar
                    user_name={this.props.user_name}
                />

                {/*
                    The "this.state.activeTab" state variable is used to determine what should be
                    displayed on a per tab basis. Any create, save, clear, and cancel buttons are
                    found in these sections. If an additional page needs to be created, it will be
                    imported at the beginning of this file.
                */}

                {this.state.activeTab==="SuperAdminUsers" &&
                    <Box className="page-spacing">
                        <div className="d-flex justify-content-between align-items-center">
                            <Typography sx={{fontWeight:'700'}} variant="h5"> 
                                Users
                            </Typography>

                            <button
                                className="btn btn-primary"
                                onClick={() => {
                                    this.setState({
                                        activeTab: "AddUser",
                                        user: null,
                                        addUser: true
                                    });
                                }}
                            >
                                Add User
                            </button>
                        </div>

                        <AdminViewUsers
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="Users" &&
                    <Box className="page-spacing">
                        <RosterDashboard
                            navbar={this}
                        />
                    </Box>
                }

                {(this.state.activeTab==="BulkUpload" || this.state.activeTab==="AdminTeamBulkUpload") &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={this.state.activeTab === "BulkUpload" ? "User" : "Team"}
                        />

                        <AdminBulkUpload
                            navbar={this}
                            tab={this.state.activeTab}
                        />
                    </Box>
                }

                {this.state.activeTab==="AddUser" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"User"}
                        />

                        <AdminViewUsers
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="Courses" &&
                    <Box className="page-spacing">
                        <AdminViewCourses
                            navbar={this}
                            />
                    </Box>
                }

                {this.state.activeTab==="AddCourse" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Course"}
                        />

                        <AdminViewCourses
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="BuildNewTeam" &&
                    <Box className="page-spacing">
                        <StudentBuildTeam
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="ManageCurrentTeam" &&
                    <Box className="page-spacing">
                        <StudentManageCurrentTeam
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab === "AddTask" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"AssessmentTask"}
                        />

                        <AdminAddAssessmentTask
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="AddTeam" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Team"}
                        />

                        <AdminAddTeam
                            navbar={this}
                        />

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
                                id="createTeamClear"
                                style={{
                                    backgroundColor: "grey",
                                    color:"white",
                                    margin: "10px 5px 5px 0"
                                }}
                                onClick={() => {
                                    if(this.state.chosenCourse["use_tas"]) {
                                        this.Reset([
                                            "teamName",
                                            "observerID"
                                        ]);
                                    } else {
                                        this.Reset([
                                            "teamName"
                                        ]);
                                    }
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </Box>
                }

                {this.state.activeTab==="Teams" &&
                    <Box className="page-spacing">
                        <TeamDashboard
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="StudentDashboard" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Course"}
                        />

                        <StudentDashboard
                            navbar={this}
                            chosenCourse={this.state.chosenCourse}
                        />
                    </Box>
                }

                {this.state.activeTab==="TeamMembers" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Team"}
                        />

                        <AdminViewTeamMembers
                            navbar={this}
                            team={this.state.team}
                            chosenCourse={this.state.chosenCourse}
                        />
                    </Box>
                }

                {this.state.activeTab==="StudentTeamMembers" &&
                    <Box className="page-spacing">
                        <StudentTeamMembers
                            team={this.state.team}
                            chosenCourse={this.state.chosenCourse}
                        />

                        <Button
                            style={{
                                backgroundColor: "black",
                                color: "white",
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
                    </Box>
                }

                {this.state.activeTab==="AssessmentTasks" &&
                    <Box className="page-spacing">
                        <AssessmentDashboard
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="ImportAssessmentTasks" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"AssessmentTask"}
                        />

                        <AdminImportAssessmentTasks
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="ViewComplete" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"AssessmentTask"}
                        />

                        <AdminViewCompleteAssessmentTasks
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="CompleteAssessment" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={this.props.isAdmin ? "CompleteTask" : "StudentCompleteTask"}
                        />

                        <CompleteAssessmentTask
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="AdminEditTeam" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"TeamMember"}
                        />
                        
                        <AdminEditTeam
                            navbar={this}
                            addTeamAction={this.state.addTeamAction}
                        />
                    </Box>
                }

                {this.state.activeTab === "AssessmentTaskInstructions" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"StudentCompleteTask"}
                        />

                        <StudentViewAssessmentTaskInstructions
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab === "SelectTeam" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"StudentCompleteTask"}
                        />

                        <SelectTeam
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab === "ConfirmCurrentTeam" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"StudentCompleteTask"}
                        />

                        <StudentConfirmCurrentTeam
                            navbar={this}
                            students={this.state.users}
                            chosenCourse={this.state.chosenCourse}
                        />
                    </Box>
                }

                {this.state.activeTab === "CodeRequired" &&
                    <Box className="page-spacing">
                         <BackButtonResource
                            navbar={this}
                            tabSelected={"StudentCompleteTask"}
                        />
                        <CodeRequirement
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab === "ViewStudentCompleteAssessmentTask" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"StudentCompleteTask"}
                        />

                        <CompleteAssessmentTask
                            navbar={this}
                        />
                    </Box>
                }
            </Box>
        )
    }
}