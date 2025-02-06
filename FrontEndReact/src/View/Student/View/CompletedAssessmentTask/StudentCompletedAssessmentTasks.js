import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ViewCompletedAssessmentTasks from './ViewCompletedAssessmentTasks.js';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import { genericResourceGET } from '../../../../utility.js';
import Loading from '../../../Loading/Loading.js';
//import Cookies from 'universal-cookie';


class StudentCompletedAssessmentTasks extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            teams: null,
            users: null,
            assessmentTasks: null,
            completedAssessments: null,
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var userRole = this.props.role["role_id"];

        var chosenCourseID = state.chosenCourse["course_id"];

        genericResourceGET(
            `/assessment_task?course_id=${chosenCourseID}`,
            "assessment_tasks", this, {dest: "assessmentTasks"}
        );

        if (userRole === 5) {       // If the user is a student, this returns completed assessments for the student
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}`,
                "completed_assessments", this, {dest: "completedAssessments"}
            );
        } else {            // If the user is a TA, this returns assessments completed by the TA
            genericResourceGET(
                `/completed_assessment?course_id=${chosenCourseID}&role_id=${userRole}`, 
                "completed_assessments", this, {dest: "completedAssessments"});
        }
    }

    render() {
        const {
            errorMessage,
            isLoaded,
            assessmentTasks,
            completedAssessments,
        } = this.state;

        
        const filteredCATs = this.props.filteredCompleteAssessments; 
        //console.warn(this.props);
        //const unitList = generateUnitList({
        //    roleName: this.props.role["role_name"],
        //    currentUserId: (new Cookies).get('user').user_id,
        //    chosenCompleteAssessmentTask: filteredCATs,//done
        //    unitType: this.state.usingTeams ? UnitType.FIXED_TEAM : UnitType.INDIVIDUAL, The problem is this line cannt figure out the logic yet
        //    assessmentTaskRubric: assessmentTaskRubric,
        //    completedAssessments,
        //    users,
        //    fixedTeams: teams,
        //    fixedTeamMembers: teamsUsers,
        //    // userFixedTeam is actually a list of a single team,
        //    //   so index to get the first entry of the list.
        //    userFixedTeam: userFixedTeam?.[0],
        //});

        if (errorMessage) {
            return(
                <div className='container'>
                    <ErrorMessage
                        fetchedResource={"Teams"}
                        errorMessage={errorMessage}
                    />
                </div>
            )

        } else if (!isLoaded || !assessmentTasks || !completedAssessments) {
            return(
                <Loading />
            )

        } else {
            return(
                <div className='container'>
                    <ViewCompletedAssessmentTasks
                        navbar={this.props.navbar}
                        completedAssessments={filteredCATs}
                        assessmentTasks={this.state.assessmentTasks}
                    />
                </div>
            )
        }
    }
}

export default StudentCompletedAssessmentTasks;
