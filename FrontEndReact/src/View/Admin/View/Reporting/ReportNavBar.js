export default class Navbar extends Component {
    /* constructor(props) {
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
            user_consent: null
        } */
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
            // if (tab==="AdminDashboard") {
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
        render() {
            const confirmCreateResource = (resource) => {
                setTimeout(() => {
                    if(document.getElementsByClassName("alert-danger")[0]===undefined) {
                        if(resource==="User") {
                            this.setState({
                                // activeTab: "AdminDashboard",
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
                                // activeTab: "AdminDashboard",
                                activeTab: "AssessmentTasks",
                                assessment_task: null,
                                addAssessmentTask: true
                            });
                        } else if (resource==="Team") {
                            this.setState({
                                // activeTab: "AdminDashboard",
                                activeTab: "Teams",
                                team: null,
                                addTeam: true
                            });
                        }
                    }
                }, 1000);
            }
        }