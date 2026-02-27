import { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form";
import { genericResourceGET, genericResourcePOST} from '../../../../utility';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading';
import { generateUnitList, UnitType } from './unit';
import { CheckinsTracker } from './cat_utils';
import { ROLE, Role } from '../../../../Enums/Role';

interface CompleteAssessmentTaskState {
    errorMessage: string | null;
    isLoaded: boolean;
    assessmentTaskRubric: any;
    teams: any[] | null;
    userFixedTeam: any;
    users: any[] | null;
    teamsUsers: any;
    currentUserRole: any;
    completedAssessments: any[] | null;
    currentUserId: string | null;
    usingTeams: boolean;
    usingAdHoc: boolean;
    checkins: CheckinsTracker;
    checkinEventSource: any;
    unitList: any[] | null;
    jumpId: any;
    isPollingSetUp: boolean,
}

/**
 * CompleteAssessmentTask component is responsible for rendering and managing the state of the complete assessment task view.
 * It fetches necessary resources and handles the logic for displaying the assessment task details, including rubrics, teams, users, and completed assessments.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.navbar - The navbar object containing the state of the chosen course and assessment task.
 * 
 * @property {Object} state - The state of the component.
 * 
 * Set by GenericResourceFetch API:
 * @property {string|null} state.errorMessage - The error message if any error occurs during resource fetching.
 * @property {boolean} state.isLoaded - Indicates whether the resources have been loaded.
 * 
 * Resources fetched in componentDidMount:
 * @property {Object|null} state.assessmentTaskRubric - The rubric of the assessment task.
 * @property {Array|null} state.teams - The list of teams.
 * @property {Object|null} state.userFixedTeam - The "fixed" team of the current user.
 * @property {Array|null} state.users - The list of users.
 * @property {Array|null} state.teamsUsers - The list of users in teams.
 * @property {Object|null} state.currentUserRole - The role of the current user.
 * @property {Array|null} state.completedAssessments - The list of completed assessments.
 * 
 * Additional state properties:
 * @property {string|null} state.currentUserId - The ID of the current user.
 * @property {boolean} state.usingTeams - Indicates whether the assessment task is using teams.
 * @property {boolean} state.usingAdHoc - Indicates if we are using adHoc teams. Note usingteams truth affects this var.
 * @property {Object|null} state.checkins - The CheckinsTracker object.
 * @property {Object|null} state.checkinEventSource - The EventSource for checkin events.
 * @property {Array|null} state.unitList - The list of units for the assessment task.
 * @property {NodeJS.Timeout} state.intervalId - The id of the polling function if it is set up.
 * @property {int|null} state.jumpId - What team or student to open first.
 * @property {boolean} state.isPollingSetUp - Indicates if the polling function interval has been setup and called.
 */ 

class CompleteAssessmentTask extends Component<any, CompleteAssessmentTaskState> {
    currentUserId: any;
    intervalId: NodeJS.Timeout | null = null;

    constructor(props: any) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            
            assessmentTaskRubric: null,
            teams: null,
            userFixedTeam: null,
            users: null,
            teamsUsers: null,
            currentUserRole: null,
            completedAssessments: null,
            
            currentUserId: null,
            usingTeams: this.props.navbar.state.unitOfAssessment,
            usingAdHoc: !this.props.navbar.state.chosenCourse.use_fixed_teams && this.props.navbar.state.unitOfAssessment,
            checkins: new CheckinsTracker(JSON.parse("[]")), // Null does not work since we get stuck in a loop in prod.
                                                             // The loop happens due to server caching as per testing.
            checkinEventSource: null,
            unitList: null,

            jumpId: this.props.navbar.state.jumpToSection, // The desired jump location student assessment tasks.
            isPollingSetUp: false,
        };
    }

    callPollingFunction = () => {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        
        genericResourceGET(
            `/checkin_events?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
            'checkin', this
        ).then(data => {
            let checkinData = new CheckinsTracker(data['checkin']);
            this.setState({
                checkins: checkinData,
            });
        }).catch(error => {
            console.warn(error);
        });
    }

    /**
     * This function sets up the polling function if the user is a TA role or above.
     */
    figureOutCheckins = () => {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const isTeams = this.state.usingTeams;
        if (this.state.currentUserRole.role_id <= ROLE.TA_INSTRUCTOR){
            this.callPollingFunction();
            this.intervalId = setInterval(this.callPollingFunction, 10000);
        }
        else {
            genericResourcePOST(
                `/checkin_events?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&is_team=${isTeams}`,
                this, "checkin"
            );
        }
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const chosenCourse = state.chosenCourse;
        const cookies = new Cookies();
        const adHocMode = this.state.usingAdHoc;
        const isTeamAssessment = this.state.usingTeams;

        this.currentUserId = cookies.get("user")["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this, { dest: "assessmentTaskRubric" }
        );

        genericResourceGET(
            `/role?user_id=${this.currentUserId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this, { dest: "currentUserRole" }
        );

        genericResourceGET(
            `/${adHocMode ? 'team/adhoc':'team'}?${adHocMode ?`assessment_task_id=${chosenAssessmentTask.assessment_task_id}`:`course_id=${chosenCourse["course_id"]}`}`,
            "teams", this
        ).then((teamsResult) => {
            if (isTeamAssessment && teamsResult.teams && teamsResult.teams.length > 0) {
                genericResourceGET(
                    `/checkin?assessment_task_id=${chosenAssessmentTask.assessment_task_id}`,
                    "checkin", this
                ).then((checkinResponse) => {
                    const checkins = checkinResponse.checkin || [];
                    
                    genericResourceGET(
                        `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
                        "users", this
                    ).then((userResponse) => {
                        const users = userResponse.users || [];
                         
                        const teamsUsersMap: {[key: string]: any[]} = {};
                        
                        teamsResult.teams.forEach((team:any) => {
                            teamsUsersMap[team.team_id] = [];
                        });
                        
                        // Add users to teams based on their checkins
                        checkins.forEach((checkin: any)=> {
                            const userId = checkin.user_id;
                            const teamId = checkin.team_number;
                            const user = users.find((u:any) => u.user_id === userId);
                            
                            const teamsUsers: any  = teamsUsersMap[teamId];

                            if (user && teamsUsers) {
                                teamsUsers.push(user);
                            }
                        });
                        
                        if (!cookies.get("user")["isAdmin"] && !cookies.get("user")["isSuperAdmin"]) {
                            const userCheckin = checkins.find((checkin:any) => checkin.user_id === this.currentUserId);
                                                        
                            if (userCheckin) {
                                const userTeamId = userCheckin.team_number;
                                const userTeam = teamsResult.teams.find((team:any) => team.team_id === userTeamId);
                                
                                this.setState({
                                    userFixedTeam: userTeam ? [userTeam] : null,
                                    teamsUsers: teamsUsersMap,
                                });
                            } else {
                                this.setState({
                                    userFixedTeam: null,
                                    teamsUsers: teamsUsersMap,
                                });
                            }
                        } else {
                            // For admins/TAs, just set the teams-users map
                            this.setState({
                                teamsUsers: teamsUsersMap,
                            });
                        }
                    });
                });
            }
        });

        genericResourceGET(
            `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
            "users", this
        );

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.usingTeams ? "team" : "individual"}`,
            "completed_assessments", this, { dest: "completedAssessments" }
        );

        this.setState({
            checkinEventSource: null,
        });
    }
    
    componentWillUnmount() {
        if (this.intervalId) { 
            clearInterval(this.intervalId); 
        } 
        this.intervalId = null; 
    }

    componentDidUpdate() { 
        if (this.state.unitList === null) {
            const {
                assessmentTaskRubric,
                teams,
                userFixedTeam,
                users,
                teamsUsers,
                currentUserRole,
                completedAssessments,
                checkins,
                isPollingSetUp,
            } = this.state; 

            if(!isPollingSetUp && currentUserRole && teams){
                this.figureOutCheckins();
                this.setState({
                    isPollingSetUp: true,
                });
            }
            
            if (assessmentTaskRubric && completedAssessments && currentUserRole && users && teams && checkins) {

                const navbar = this.props.navbar;
                const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];
                const chosenAssessmentTask = navbar.state.chosenAssessmentTask;
                const roleName = currentUserRole["role_name"];

                if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) return;
                if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) return;
                if (roleName === "Student" && this.state.usingTeams && !userFixedTeam) return;
                if (this.state.usingTeams && !teamsUsers) return;
                
                const userSort = [...users].sort((firstUser,secondUser) => {
                    const firstLastName = firstUser.last_name.toLowerCase();
                    const secondLastName = secondUser.last_name.toLowerCase();
                    if(firstLastName < secondLastName) return -1;
                    if(firstLastName > secondLastName) return 1;
                    return 0;
                });

                const teamSort = [...teams].sort((firstTeam, secondTeam) => {
                    const firstTeamName = firstTeam.team_name.toLowerCase();
                    const secondTeamName = secondTeam.team_name.toLowerCase();
                    if(firstTeamName < secondTeamName) return -1;
                    if(firstTeamName > secondTeamName) return 1;
                    return 0;
                });

                const unitClass = this.state.usingTeams ? (this.state.usingAdHoc ? UnitType.AD_HOC_TEAM:UnitType.FIXED_TEAM)
                                                        : UnitType.INDIVIDUAL;
                                                        
                const unitList = generateUnitList({
                    roleName: roleName,
                    currentUserId: this.currentUserId,
                    chosenCompleteAssessmentTask: navbar.state.chosenCompleteAssessmentTask,
                    unitType: unitClass,
                    assessmentTaskRubric: assessmentTaskRubric,
                    completedAssessments,
                    users: userSort,
                    fixedTeams: teamSort,
                    fixedTeamMembers: teamsUsers,
                    // userFixedTeam is actually a list of a single team,
                    //   so index to get the first entry of the list.
                    userFixedTeam: userFixedTeam?.[0],
                });

                this.setState({
                    unitList,
                });
            }
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,

            assessmentTaskRubric,
            teams,
            userFixedTeam,
            users,
            teamsUsers,
            currentUserRole,
            completedAssessments,
            checkins,
            usingAdHoc,
        } = this.state;

        const navbar = this.props.navbar;
        const fixedTeams = navbar.state.chosenCourse["use_fixed_teams"];
        const chosenAssessmentTask = navbar.state.chosenAssessmentTask;

        if (errorMessage) {
            return (
                <ErrorMessage
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !assessmentTaskRubric || !completedAssessments || !currentUserRole || !users || !teams || !checkins) {
            return (
                <Loading />
            );
        } else if (chosenAssessmentTask["unit_of_assessment"] && (fixedTeams && teams.length === 0)) {
            return (
                <h1>Please create a team to complete this assessment.</h1>
            );
        } else if (!chosenAssessmentTask["unit_of_assessment"] && users.length === 0) {
            return (
                <h1>Please add students to the roster to complete this assessment.</h1>
            );
        } else if (usingAdHoc && teams.length < 1){
            return (
                <h1>No team has any students checked in at the moment.</h1>
            );
        }

        const roleName = currentUserRole["role_name"];

        if (roleName === "Student" && this.state.usingTeams && !this.state.usingAdHoc && !userFixedTeam){
            return (
                <Loading />
            );
        }

        if (roleName !== "Student" && this.state.usingTeams && !teamsUsers) {
            return (
                <Loading />
            );
        }

        const unitList = this.state.unitList;

        if (!unitList) {
            return (
                <Loading />
            );
        }

        return (
            <Box>
                <Box className="assessment-title-spacing">
                    <Box className='d-flex flex-column justify-content-start'>
                        <h4>{chosenAssessmentTask["assessment_task_name"]} - {assessmentTaskRubric["rubric_name"]}</h4>
                        <h5>{assessmentTaskRubric["rubric_description"]}</h5>
                    </Box>
                </Box>

                <Form
                    navbar={this.props.navbar}
                    roleName={this.state.currentUserRole["role_name"]}
                    checkins={this.state.checkins}
                    assessmentTaskRubric={assessmentTaskRubric}
                    units={unitList}
                    usingTeams={this.state.usingTeams}
                    jumpId={this.state.jumpId}
                />
            </Box>
        );
    }
}

export default CompleteAssessmentTask;