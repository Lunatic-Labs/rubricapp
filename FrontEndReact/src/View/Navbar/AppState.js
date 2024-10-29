import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Button from '@mui/material/Button';
import AdminViewUsers from '../Admin/View/ViewUsers/AdminViewUsers.js';
import AdminViewCourses from '../Admin/View/ViewCourses/AdminViewCourses.js';
import RosterDashboard from '../Admin/View/ViewDashboard/RosterDashboard.js';
import AssessmentDashboard from '../Admin/View/ViewDashboard/AssessmentDashboard.js';
import AdminViewCompleteAssessmentTasks from '../Admin/View/ViewCompleteAssessmentTasks/AdminViewCompleteAssessmentTasks.js';
import AdminImportAssessmentTasks from '../Admin/Add/ImportTasks/AdminImportAssessmentTasks.js';
import CompleteAssessmentTask from '../Admin/View/CompleteAssessmentTask/CompleteAssessmentTask.js';
import AdminViewTeamMembers from '../Admin/View/ViewTeamMembers/AdminViewTeamMembers.js';
import AdminBulkUpload  from '../Admin/Add/AddUsers/AdminBulkUpload.js';
import StudentDashboard from '../Student/StudentDashboard.js'
import StudentTeamMembers from '../Student/View/Team/StudentTeamMembers.js';
import AdminEditTeamMembers from '../Admin/Add/AddTeam/AdminEditTeamMembers.js'
import TeamDashboard from '../Admin/View/ViewDashboard/TeamDashboard.js';
import AdminAddTeam from '../Admin/Add/AddTeam/AdminAddTeam.js';
import AdminAddAssessmentTask from '../Admin/Add/AddTask/AdminAddAssessmentTask.js';
import ButtonAppBar from './Navbar.js';
import { Box, Typography } from '@mui/material';
import BackButtonResource from '../Components/BackButtonResource.js';
import StudentConfirmCurrentTeam from '../Student/View/ConfirmCurrentTeam/StudentConfirmCurrentTeam.js';
import StudentViewAssessmentTaskInstructions from '../Student/View/AssessmentTask/StudentViewAssessmentTaskInstructions.js'
import SelectTeam from '../Student/View/SelectTeam/SelectTeam.js';
import CodeRequirement from '../Student/View/TeamPassword/CodeRequirement.js';
import StudentBuildTeam from '../Student/View/BuildTeam/StudentBuildTeam.js';
import StudentManageCurrentTeam from '../Student/View/BuildTeam/StudentBuildTeam.js';
import StudentNavigation from '../Components/StudentNavigation.js';
import ReportingDashboard from '../Admin/View/Reporting/ReportingDashboard.js';
import AdminAddCustomRubric from '../Admin/Add/AddCustomRubric/AdminAddCustomRubric.js';
import AdminViewCustomRubrics from '../Admin/View/ViewCustomRubrics/AdminViewCustomRubrics.js';
import UserAccount from './UserAccount.js'


class AppState extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.isSuperAdmin ? "SuperAdminUsers" : "Courses",

            user: null,
            addUser: null,

            course: null,
            addCourse: null,

            assessmentTask: null,
            addAssessmentTask: true,

            chosenAssessmentTask: null,
            chosenCompleteAssessmentTask: null,
            unitOfAssessment: null,
            chosenCompleteAssessmentTaskIsReadOnly: false,

            team: null,
            addTeam: true,

            teams: null,
            users: null,

            chosenCourse: null,

            roleNames: null,
            rubricNames: null,
            userConsent: null,

            addTeamAction: null,
            
            successMessage: null,
            successMessageTimeout: undefined,

            addCustomRubric: null,
        }

        this.setNewTab = (newTab) => {
            this.setState({
                activeTab: newTab
            });
        }


        this.setAddUserTabWithUser = (users, userId) => {
            var newUser = null;

            for (var u = 0; u < users.length; u++) {
                if (users[u]["user_id"] === userId) {
                    newUser = users[u];
                }
            }

            this.setState({
                activeTab: "AddUser",
                user: newUser,
                addUser: false
            });
        }

        this.setAddCourseTabWithCourse = (courses, courseId, tab) => {
            if (courses.length === 0 && courseId === null && tab === "AddCourse") {
                this.setState({
                    activeTab: tab,
                    course: null,
                    addCourse: true
                });

            } else {
                var newCourse = null;

                for (var c = 0; c < courses.length; c++) {
                    if (courses[c]["course_id"] === courseId) {
                        newCourse = courses[c];
                    }
                }

                if (tab === "Users") {
                    this.setState({
                        activeTab: tab,
                        chosenCourse: newCourse
                    });

                } else {
                    this.setState({
                        activeTab: tab,
                        course: newCourse,
                        addCourse: false
                    });
                }
            }
        }

        this.setAssessmentTaskInstructions = (assessmentTasks, assessmentTaskId, completedAssessments=null, {
            readOnly = false
        }={}) => { // wip
            var completedAssessment = null;

            if (completedAssessments) {
               completedAssessment = completedAssessments.find(completedAssessment => completedAssessment.assessment_task_id === assessmentTaskId) ?? null;
            }
            const assessmentTask = assessmentTasks.find(assessmentTask => assessmentTask["assessment_task_id"] === assessmentTaskId);
            
            this.setState({
                activeTab: "AssessmentTaskInstructions",
                chosenCompleteAssessmentTask: completedAssessments ? completedAssessment : null,
                chosenAssessmentTask: assessmentTask,
                unitOfAssessment: assessmentTask["unit_of_assessment"],
                chosenCompleteAssessmentTaskIsReadOnly: readOnly,
            });
        }

        this.setConfirmCurrentTeam = (assessmentTasks, assessmentTaskId, switchTeam) => {
            var assessmentTask = null;

            for (var index = 0; index < assessmentTasks.length; index++) {
                if (assessmentTasks[index]["assessment_task_id"] === assessmentTaskId) {
                    assessmentTask = assessmentTasks[index];
                }
            }

            const tab = switchTeam ? "CodeRequired" : "ConfirmCurrentTeam"

            this.setState({
                activeTab: tab,
                chosenAssessmentTask: assessmentTask,
                unitOfAssessment: assessmentTask["unit_of_assessment"]
            });
        }

        this.setSelectCurrentTeam = (assessmentTasks, assessmentTaskId) => {
            var assessmentTask = null;

            for (var index = 0; index < assessmentTasks.length; index++) {
                if (assessmentTasks[index]["assessment_task_id"] === assessmentTaskId) {
                    assessmentTask = assessmentTasks[index];
                }
            }

            this.setState({
                activeTab: "SelectTeam",
                chosenAssessmentTask: assessmentTask,
                unitOfAssessment: assessmentTask["unit_of_assessment"]
            });
        }

        this.setAddAssessmentTaskTabWithAssessmentTask = (assessmentTasks, assessmentTaskId, course, roleNames, rubricNames) => {
            var newAssessmentTask = null;

            for (var a = 0; a < assessmentTasks.length; a++) {
                if (assessmentTasks[a]["assessment_task_id"] === assessmentTaskId) {
                    newAssessmentTask = assessmentTasks[a];
                }
            }

            this.setState({
                activeTab: "AddTask",
                course: course,
                assessmentTask: newAssessmentTask,
                addAssessmentTask: false,
                roleNames: roleNames,
                rubricNames: rubricNames
            });
        }

        this.setCompleteAssessmentTaskTabWithID = (assessmentTask) => {
            if(assessmentTask && assessmentTask.unit_of_assessment !== undefined){
                this.setState({
                    activeTab: "ViewComplete",
                    chosenAssessmentTask: assessmentTask,
                    unitOfAssessment: assessmentTask.unit_of_assessment
                });
            }
            else {
                this.setState({
                    activeTab: "ViewComplete",
                    chosenAssessmentTask: null,
                    unitOfAssessment: null
                });
            }
        }

        this.setAddTeamTabWithTeam = (teams, teamId, users, tab, addTeamAction) => {
            var newTeam = null;

            for (var t = 0; t < teams.length; t++) {
                if (teams[t]["team_id"] === teamId) {
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
        // The only purpose was to test to see if we could see the "My Assessment Task" 
        // on the student dashboard
        // When you click "complete" on the "TO DO" column the completed fields were null 
        // thus it would not display anything
        // By adding === null as a test case, we were able to have it populate.
        this.setViewCompleteAssessmentTaskTabWithAssessmentTask = (completedAssessmentTasks, completedAssessmentId, chosenAssessmentTask) => {
            if (completedAssessmentTasks === null && completedAssessmentId === null && chosenAssessmentTask === null) {
                this.setState({
                    activeTab: "CompleteAssessment",
                    chosenAssessmentTask: null,
                    unitOfAssessment: null,
                    chosenCompleteAssessmentTask: null,
                    chosenCompleteAssessmentTaskIsReadOnly: false,
                });

            } else {
                var newCompletedAssessmentTask = null;

                for (var c = 0; c < completedAssessmentTasks.length; c++) {
                    if (completedAssessmentTasks[c]["completed_assessment_id"] === completedAssessmentId) {
                        newCompletedAssessmentTask = completedAssessmentTasks[c];
                    }
                }
                this.setState({
                    activeTab: "CompleteAssessment",
                    chosenCompleteAssessmentTask: newCompletedAssessmentTask,
                    chosenCompleteAssessmentTaskIsReadOnly: false,
                    chosenAssessmentTask: chosenAssessmentTask,
                    unitOfAssessment: chosenAssessmentTask["unit_of_assessment"]
                });
            }
        }

        this.ViewCTwithAT = (assessmentTasks, atId) => {
            var selectedAssessment = null;

            for(var index = 0; index < assessmentTasks.length; index++) {
                if(assessmentTasks[index]["assessment_task_id"] === atId) {
                    selectedAssessment = assessmentTasks[index];
                }
            }

            this.setState({
                activeTab: "CompleteAssessment",
                chosenAssessmentTask: selectedAssessment,
                unitOfAssessment: selectedAssessment["unit_of_assessment"]
            });
        };

        this.setEditConsentWithUser = (userId, users) => {
            var newUser = null;

            for (var i = 0; i < users.length; i++) {
                if (users[i]["user_id"] === userId) {
                    newUser = users[i];
                }
            }

            this.setState({
                activeTab: "EditConsent",
                userConsent: newUser
            });
        }

        this.setStudentDashboardWithCourse = (courseId, courses) => {
            var chosenCourse = null;

            for (var i = 0; i < courses.length; i++) {
                if (courses[i]["course_id"] === courseId) {
                    chosenCourse = courses[i];
                }
            }

            this.setState({
                activeTab: "StudentDashboard",
                chosenCourse: chosenCourse
            });
        }

        this.confirmCreateResource = (resource, delay = 1000) => {
            setTimeout(() => {
                if (document.getElementsByClassName("alert-danger")[0] === undefined) {
                    if (resource === "User" || resource === "UserBulkUpload") {
                        this.setState({
                            activeTab: this.props.isSuperAdmin ? "SuperAdminUsers" : "Users",
                            user: null,
                            addUser: null
                        });
                        
                        if (resource === "UserBulkUpload") {
                            this.setSuccessMessage("The user bulk upload was successful!");
                        }

                    } else if (resource === "Course") {
                        this.setState({
                            activeTab: "Courses",
                            course: null,
                            addCourse: null
                        });

                    } else if (resource === "AssessmentTask") {
                        this.setState({
                            activeTab: "AssessmentTasks",
                            assessmentTask: null,
                            addAssessmentTask: true
                        });

                    } else if (resource === "ImportAssessmentTasks") {
                        this.setState({
                            activeTab: "AssessmentTasks"
                        });

                    } else if (resource === "Team" || resource === "TeamBulkUpload") {
                        this.setState({
                            activeTab: "Teams",
                            team: null,
                            addTeam: true
                        });
                        
                        if (resource === "TeamBulkUpload") {
                            this.setSuccessMessage("The team bulk upload was successful!");
                        }

                    } else if (resource==="TeamMembers") {
                        this.setState({
                            activeTab: "TeamMembers",
                            addTeamAction: null
                        });

                    } else if (resource==="CompleteTask") {
                        this.setState({
                            activeTab: "ViewComplete",
                            chosenCompleteAssessmentTask: null
                        });

                    } else if(resource==="StudentCompleteTask") {
                        this.setState({
                            activeTab: "StudentDashboard",
                            chosenAssessmentTask: null,
                            unitOfAssessment: null
                        });
                    } else if (resource==="CreateCustomRubric") {
                        this.setState({
                            activeTab: "AddCustomRubric"
                        });
                    } else if (resource==="MyCustomRubrics") {
                        this.setState({
                            activeTab: "MyCustomRubrics"
                        });
                    }
                }
            }, delay);
        }

        this.Reset = (listOfElements) => {
            for (var element = 0; element < listOfElements.length; element++) {
                document.getElementById(listOfElements[element]).value = "";

                if (document.getElementById(listOfElements[element]).getAttribute("type") === "checkbox") {
                    document.getElementById(listOfElements[element]).checked = false;
                }
            }
        }
        
        this.setSuccessMessage = (newSuccessMessage) => {
            clearTimeout(this.state.successMessageTimeout);
            
            const timeoutId = setTimeout(() => {
                this.setState({
                    successMessage: null,
                    successMessageTimeout: undefined,
                });
            }, 3000);
            
            this.setState({
                successMessage: newSuccessMessage,
                successMessageTimeout: timeoutId,
            });
        };
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
                    userName={this.props.userName}
                    logout={this.props.logout}
                    setNewTab={this.setNewTab}
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
                            <Typography aria-label="superAdminTitle" sx={{fontWeight:'700'}} variant="h5"> 
                                Users
                            </Typography>

                            <Button
                                className="primary-color"
                                variant='contained'
                                onClick={() => {
                                    this.setState({
                                        activeTab: "AddUser",
                                        user: null,
                                        addUser: true
                                    });
                                }}
                            >
                                Add User
                            </Button>
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
                            aria-label="adminBulkUpload"
                        />
                    </Box>
                }
                
                {this.state.activeTab==="AddCustomRubric" &&
                  <Box className="page-spacing">
                      <BackButtonResource
                          navbar={this}
                          tabSelected={"MyCustomRubrics"}
                      />

                      <AdminAddCustomRubric
                          navbar={this}
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

                {/* {this.state.activeTab==="EditCustomRubric" &&
                  <Box className="page-spacing">
                      <BackButtonResource
                          navbar={this}
                          tabSelected={"MyCustomRubrics"}
                      />
                      <AdminEditCustomRubric
                          navbar={this}
                      />
                  </Box>
                }

                {this.state.activeTab==="DeleteCustomRubric" &&
                  <Box className="page-spacing">
                      <BackButtonResource
                          navbar={this}
                          tabSelected={"MyCustomRubrics"}
                      />
                      <AdminDeleteCustomRubric
                          navbar={this}
                      />
                  </Box>
                } */}
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
                            confirmCreateResource={this.confirmCreateResource}
                        />
                    </Box>
                }

                {this.state.activeTab==="Teams" &&
                    <Box className="page-spacing">
                        <TeamDashboard
                            navbar={this}
                            aria-label="teamDashboard"
                        />
                    </Box>
                }

                {this.state.activeTab==="StudentDashboard" &&
                    <Box className="page-spacing">
                        <Box>
                            <StudentNavigation
                                navbar={this}
                                tabSelected={"Course"}
                            />
                        </Box>

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
                            aria-label="assessmentDashboard"
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

                {this.state.activeTab==="AdminEditTeamMembers" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"TeamMembers"}
                        />

                        <AdminEditTeamMembers
                            navbar={this}
                            addTeamAction={this.state.addTeamAction}
                        />
                    </Box>
                }

                {this.state.activeTab === "AssessmentTaskInstructions" &&
                    <Box className="page-spacing">
                        <StudentNavigation
                            navbar={this}
                            tabSelected={this.props.isAdmin ? "AssessmentTask" : "StudentCompleteTask"}
                        />

                        <StudentViewAssessmentTaskInstructions
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab === "SelectTeam" &&
                    <Box className="page-spacing">
                        <StudentNavigation
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
                        <Box>
                            <StudentNavigation
                                navbar={this}
                                tabSelected={"StudentCompleteTask"}
                            />
                        </Box>

                        <StudentConfirmCurrentTeam
                            navbar={this}
                            students={this.state.users}
                            chosenCourse={this.state.chosenCourse}
                        />
                    </Box>
                }

                {this.state.activeTab === "CodeRequired" &&
                    <Box className="page-spacing">
                        <StudentNavigation
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
                        <StudentNavigation
                            navbar={this}
                            tabSelected={this.props.isAdmin ? "AssessmentTask" : "StudentCompleteTask"}
                        />

                        <CompleteAssessmentTask
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="Reporting" &&
                    <Box className="page-spacing">
                        <ReportingDashboard
                            navbar={this}
                            aria-label="reportingDashboard"
                        />
                    </Box>
                }

                {this.state.activeTab==="MyCustomRubrics" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"AssessmentTask"}
                            aria-label="myCustomRubricsBackButton"
                        />

                        <AdminViewCustomRubrics
                            navbar={this}
                        />
                    </Box>
                }

                {this.state.activeTab==="UserAccount" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Course"}
                            aria-label="UserAccountBackButton"
                        />

                        <UserAccount
                            navbar={this}
                        />
                    </Box>
                }
            </Box>
        )
    }
}

export default AppState;
