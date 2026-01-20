import { Component } from 'react';
import Cookies from 'universal-cookie';
// @ts-ignore: allow importing CSS without type declarations
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
import AdminEditTeamMembers from '../Admin/Add/AddTeam/AdminEditTeamMembers'
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
import StudentNavigation from '../Components/StudentNavigation';
import ReportingDashboard from '../Admin/View/Reporting/ReportingDashboard';
import AdminAddCustomRubric from '../Admin/Add/AddCustomRubric/AdminAddCustomRubric';
import AdminViewCustomRubrics from '../Admin/View/ViewCustomRubrics/AdminViewCustomRubrics';
import UserAccount from './UserAccount';
import PrivacyPolicy from './PrivacyPolicy';
import ViewNotification from '../Admin/View/ViewDashboard/Notifications';
import Settings from './Settings';
import { genericResourceGET } from "../../utility";


interface AppStateProps {
    isSuperAdmin?: boolean;
    isAdmin?: boolean;
    userName?: string;
    logout?: any;
}

interface AppStateState {
    activeTab: string;
    user: any;
    addUser: any;
    course: any;
    addCourse: any;
    assessmentTask: any;
    addAssessmentTask: boolean;
    chosenAssessmentTask: any;
    chosenCompleteAssessmentTask: any;
    unitOfAssessment: any;
    chosenCompleteAssessmentTaskIsReadOnly: boolean;
    team: any;
    addTeam: boolean;
    teams: any;
    users: any;
    chosenCourse: any;
    roleNames: any;
    rubricNames: any;
    userConsent: any;
    addTeamAction: any;
    successMessage: any;
    successMessageTimeout: any;
    addCustomRubric: any;
    jumpToSection: any;
    skipInstructions?: boolean;
    isLoaded?: boolean | null;
    darkMode?: boolean;
}

class AppState extends Component<AppStateProps, AppStateState> {
    Reset: any;
    ViewCTwithAT: any;
    confirmCreateResource: any;
    resetJump: any;
    setAddAssessmentTaskTabWithAssessmentTask: any;
    setAddCourseTabWithCourse: any;
    setAddCustomRubric: any;
    setAddTeamTabWithTeam: any;
    setAddTeamTabWithUsers: any;
    setAddUserTabWithUser: any;
    setAssessmentTaskInstructions: any;
    setCompleteAssessmentTaskTabWithID: any;
    setConfirmCurrentTeam: any;
    setEditConsentWithUser: any;
    setNewTab: any;
    setSelectCurrentTeam: any;
    setStudentDashboardWithCourse: any;
    setSuccessMessage: any;
    setViewCompleteAssessmentTaskTabWithAssessmentTask: any;
    constructor(props: AppStateProps) {
        super(props);
        
        // --Checks for access token and/or user tokens-- 
        // Redirects user to root path if unable to authenticate
        const cookies =new Cookies();
        if (!cookies.get('access_token') || !cookies.get('user')){
            window.location.href = '/';
            return
        }
        
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
            jumpToSection: null,

            isLoaded: null,
            darkMode: false,
        }

        this.setNewTab = (newTab: any) => {
            this.setState({
                activeTab: newTab
            });
        }


        this.setAddUserTabWithUser = (users: any, userId: any) => {
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

        this.setAddCourseTabWithCourse = (courses: any, courseId: any, tab: any) => {
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

        this.setAssessmentTaskInstructions = (assessmentTasks: any, assessmentTaskId: any, completedAssessments: any = null, {
            readOnly = false,
            skipInstructions = false
        }={}) => {
            
            var completedAssessment = null;

            if (completedAssessments) {
                if (!Array.isArray(completedAssessments) && 
                    completedAssessments.assessment_task_id === assessmentTaskId) {
                    // Single CAT object passed - use it directly
                    completedAssessment = completedAssessments;
                } 
                // If it's an array, search for matching assessment_task_id
                else if (Array.isArray(completedAssessments)) {
                    completedAssessment = completedAssessments.find(
                        (cat: any) => cat.assessment_task_id === assessmentTaskId
                    ) ?? null;
                }
            }
            
            const assessmentTask = assessmentTasks.find(
                (assessmentTask: any) => assessmentTask["assessment_task_id"] === assessmentTaskId
            );

            this.setState({
                activeTab: "AssessmentTaskInstructions",
                chosenCompleteAssessmentTask: completedAssessments ? completedAssessment : null,
                chosenAssessmentTask: assessmentTask,
                unitOfAssessment: assessmentTask["unit_of_assessment"],
                chosenCompleteAssessmentTaskIsReadOnly: readOnly,
                skipInstructions: skipInstructions
            });
        }

        this.setConfirmCurrentTeam = (assessmentTasks: any, assessmentTaskId: any, switchTeam: any) => {
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

        this.setSelectCurrentTeam = (assessmentTasks: any, assessmentTaskId: any) => {
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

        this.setAddAssessmentTaskTabWithAssessmentTask = (assessmentTasks: any, assessmentTaskId: any, course: any, roleNames: any, rubricNames: any) => {
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

        this.setCompleteAssessmentTaskTabWithID = (assessmentTask: any) => {
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
        this.setAddTeamTabWithTeam = (teams: any, teamId: any, users: any, tab: any, addTeamAction: any) => {
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

        this.setAddTeamTabWithUsers = (users: any) => {
            this.setState({
                activeTab: "AddTeam",
                users: users
            })
        }

        // Use this as a callback Function to prevent jump data from being sticky.
        this.resetJump = () => {
            this.setState({
                jumpToSection: null,
            })
        };

        // The ===null section of the next line is not permanent. 
        // The only purpose was to test to see if we could see the "My Assessment Task" 
        // on the student dashboard
        // When you click "complete" on the "TO DO" column the completed fields were null 
        // thus it would not display anything
        // By adding === null as a test case, we were able to have it populate.
        this.setViewCompleteAssessmentTaskTabWithAssessmentTask = (completedAssessmentTasks: any, completedAssessmentId: any, chosenAssessmentTask: any, jumpId=null) => {
            if (completedAssessmentTasks === null && completedAssessmentId === null && chosenAssessmentTask === null) {
                this.setState({
                    activeTab: "CompleteAssessment",
                    chosenAssessmentTask: null,
                    unitOfAssessment: null,
                    chosenCompleteAssessmentTask: null,
                    chosenCompleteAssessmentTaskIsReadOnly: false,
                    jumpToSection: jumpId,
                }, () =>{
                    if(jumpId !== null){
                        this.resetJump();
                    }
                }
            );

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
                    unitOfAssessment: chosenAssessmentTask["unit_of_assessment"],
                    jumpToSection: jumpId,
                }, () => {
                    if(jumpId !== null){
                        this.resetJump();
                    }
                }
            );
            }
        }; 

        this.ViewCTwithAT = (assessmentTasks: any, atId: any) => {
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

        this.setEditConsentWithUser = (userId: any, users: any) => {
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

        this.setStudentDashboardWithCourse = (courseId: any, courses: any) => {
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

        this.setAddCustomRubric = (addCustomRubric: any) => {

            this.setState({
                activeTab: "AddCustomRubric",
                addCustomRubric: addCustomRubric
            });
        }

        this.confirmCreateResource = (resource: any, delay = 1000) => {
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

        this.Reset = (listOfElements: any) => {
            for (var element = 0; element < listOfElements.length; element++) {
                const el = document.getElementById(listOfElements[element]) as HTMLInputElement;
                if (el) {
                    el.value = "";
                    if (el.getAttribute("type") === "checkbox") {
                        el.checked = false;
                    }
                }
            }
        }
        
        this.setSuccessMessage = (newSuccessMessage: any) => {
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

    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //
    // THE COMMENTED OUT CODE ABOVE DOES NOT RELATE TO THE CODE BELOW //
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! //

    // This code here was added for rendering darkmode if the user has set
    // it as thier preferance.
    // componentDidMount can be modified to accomodate more functions as the
    // app is updated.
    componentDidMount() {
        const cookies = new Cookies();
        const user = cookies.get('user');
        
        // if users darkmode preferance is saved in cookies it will be loaded.
        if (user && user.user_dark_mode) {
            document.body.classList.add('mode');
        } else {
            document.body.classList.remove('mode');
        }
        
        // if darkmode is not saved in cookies, the API will be called to check
        // the backend if the user has darkmode preferance set to 'true'
        if (user !== null) {
            let promise: Promise<any>;            // promise is used because we do not yet have the 'data' from the backend
            let userData: any;           // promise tells the app that it will recieve data

            // get all the neccessary resources from the backend, the 'user' from the 'users' array.
            promise = genericResourceGET(
                `/user`,
                "users",
                this
            );

            promise.then(result => {
                if (result !== undefined && result["users"] !== null) {
                    userData = result["users"];
                    
                    // user data is now set by the result for 'users' and the state is changed
                    // to match the users preferance (false or true).
                    this.setState({
                        isLoaded: true,
                        user: userData["user_id"],
                        darkMode: userData["user_dark_mode"]
                    }, () => {
                        // This callback runs AFTER state is updated
                        if (this.state.darkMode) {
                            document.body.classList.add('mode');
                        } else {
                            document.body.classList.remove('mode');
                        }
                    });

                    
                }
            }).catch(error => {
                console.error("Error fetching user data:", error);
                // Fallback to user object
                this.setState({
                    isLoaded: false,
                    user: user,
                    darkMode: user["user_dark_mode"] || false,
                }, () => {
                    // Apply dark mode in callback
                    if (this.state.darkMode) {
                        document.body.classList.add('mode');
                    } else {
                        document.body.classList.remove('mode');
                    }
                });
            });
        }
    }

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
                            <Box>
                                <div style={{display:"flex", gap:"20px"}}>
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
                                    <Button 
                                        className="primary-color"
                                        variant='contained'
                                        onClick={() => {
                                            this.setState({
                                                activeTab: "ViewNotification",
                                                user: null,
                                                addUser: true
                                            });
                                        }}
                                    >
                                        View Notifications
                                    </Button>
                                </div>
                            </Box>
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
                    <Box className="page-spacing" aria-label="teamDashboard">
                        <TeamDashboard
                            navbar={this}
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
                            navbar={this}
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
                    <Box className="page-spacing" aria-label="assessmentDashboard">
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
                    <Box className="page-spacing" aria-label="reportingDashboard">
                        <ReportingDashboard
                            navbar={this}
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
                {this.state.activeTab==="PrivacyPolicy" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Course"}
                            aria-label="UserAccountBackButton"
                        />

                        <PrivacyPolicy
                            navbar={this}
                        />
                    </Box>
                }
                {this.state.activeTab==="Settings" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"Course"}
                            aria-label="UserAccountBackButton"
                        />

                        <Settings
                            navbar={this}
                        />
                    </Box>
                }
                {this.state.activeTab==="ViewNotification" &&
                    <Box className="page-spacing">
                        <BackButtonResource
                            navbar={this}
                            tabSelected={"User"}
                        />
                        <ViewNotification
                            navbar={this}
                        />
                    </Box>
                }
            </Box>
        )
    }
}

export default AppState;
