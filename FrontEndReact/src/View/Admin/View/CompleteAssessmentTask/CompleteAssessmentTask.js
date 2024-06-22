import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Form from "./Form.js";
import { genericResourceGET } from '../../../../utility.js';
import { Box } from '@mui/material';
import ErrorMessage from '../../../Error/ErrorMessage.js';
import Cookies from 'universal-cookie';
import Loading from '../../../Loading/Loading.js';



class CompleteAssessmentTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            rubrics: null,
            teams: null,
            users: null,
            teams_users: null,
            unitOfAssessment: this.props.navbar.state.unitOfAssessment,
            roles: null,
            completedAssessments: null,
            checkin: null,
            userId: null
        }
        this.doRubricsForCompletedMatch = (newCompleted, storedCompleted) => {
            var newCompletedCategories = Object.keys(newCompleted).sort();

            var storedCompletedCategories = Object.keys(storedCompleted).sort();

            if (newCompletedCategories.length !== storedCompletedCategories.length) {
                return false;
            }

            for (var index = 0; index < newCompletedCategories.length; index++) {
                if (newCompletedCategories[index] !== storedCompletedCategories[index]) {
                    return false;
                }
            }

            return true;
        }

        this.getCompleteTeam = (teamId) => {
            var completedTeam = this.state.completedAssessments.find(completedAssessment => completedAssessment["team_id"] === teamId);
            
            return completedTeam ? completedTeam : false;
        }

        this.getCompleteIndividual = (userId) => {
            var completedAssessment = this.state.completedAssessments.find(completedAssessment => completedAssessment["user_id"] === userId);

            return completedAssessment ? completedAssessment : false;
        }

        this.handleDone = () => {
            var navbar = this.props.navbar;

            var chosenAssessmentTask = navbar.state.chosenCompleteAssessmentTask;

            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.unitOfAssessment ? "team" : "individual"}`,
                "completedAssessments", this
            );
        }

        this.refreshUnits = () => {
            var navbar = this.props.navbar;

            var chosenAssessmentTask = navbar.state.chosenCompleteAssessmentTask;

            genericResourceGET(
                `/checkin?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
                 "checkin", this
            );
        }
    }

    componentDidUpdate(prevProps, prevState) {
        
        if (prevState.rubrics === null && prevState.teams === null && prevState.teams_users === null) {
            if (this.state.unitOfAssessment && this.state.teams && this.state.teams.length > 0) {
                var teamIds = this.state.teams.map(team => team.team_id);

                genericResourceGET(
                    `/user?team_ids=${teamIds}`,
                    "teams_users", this
                );
            }
        }
    }

    componentDidMount() {
        var navbar = this.props.navbar;

        var state = navbar.state;

        var chosenAssessmentTask = state.chosenAssessmentTask;

        var chosenCourse = state.chosenCourse;
    
        const cookies = new Cookies();

        this.userId = cookies.get('user')["user_id"];

        genericResourceGET(
            `/rubric?rubric_id=${chosenAssessmentTask["rubric_id"]}`,
            "rubrics", this
        );

        genericResourceGET(
            `/role?user_id=${this.userId}&course_id=${chosenCourse["course_id"]}`,
            "roles", this
        );

        if (chosenAssessmentTask["role_id"] === 5) {
            genericResourceGET(
                `/team_by_user?user_id=${this.userId}&course_id=${chosenCourse["course_id"]}`,
                "team", this
            );
        }

        genericResourceGET( 
            `/checkin?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}`,
             "checkin", this
        );

        genericResourceGET(
            `/team?course_id=${chosenCourse["course_id"]}`,
            "teams", this
        );
    
        genericResourceGET(
            `/user?course_id=${chosenCourse["course_id"]}&role_id=5`,
            "users", this
        );

        genericResourceGET(
            `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=${this.state.unitOfAssessment ? "team" : "individual"}`,
            "completedAssessments", this
        );

    }

    render() {
        const {
            errorMessage,
            isLoaded,
            rubrics,
            teams,
            team,
            unitOfAssessment,
            users,
            teams_users,
            roles,
            completedAssessments
        } = this.state;
        if (errorMessage) {
            return (
                <ErrorMessage
                    fetchedResource={"Complete Assessment Task"}
                    errorMessage={errorMessage}
                />
            );

        } else if (!isLoaded || !rubrics || !completedAssessments|| !roles || !users || !teams ) {
            return (
                <Loading />
            );

        } 
        var role_name=roles["role_name"]
        if (role_name !== "Student" && this.state.unitOfAssessment && !teams_users) {
            return (
                <Loading />
            );  
        } else {
            var navbar = this.props.navbar;

            var chosenCompleteAssessmentTask = navbar.state.chosenCompleteAssessmentTask;
            var chosenAssessmentTask = navbar.state.chosenAssessmentTask;
   
            var json = rubrics["category_rating_observable_characteristics_suggestions_json"];

            json["done"] = false;

            json["comments"] = "";

            if (role_name === "Student") {  
                // If the user is a student, this prepares assessments for the student or their team
                var singleUnitData = {};

                var singleTeam = [];
    
                var singleUser = [];

                var data = json;
                // There is an existing assessment for this student
                if (Object.keys(chosenCompleteAssessmentTask).length > 0) {
                    chosenCompleteAssessmentTask = chosenCompleteAssessmentTask[0];
                    data = chosenCompleteAssessmentTask["rating_observable_characteristics_suggestions_data"];
    
                    if (data && this.doRubricsForCompletedMatch(json, data)) {
                        data["done"] = chosenCompleteAssessmentTask["done"];
                    } 
  
                    if (this.state.unitOfAssessment)  { 

                        var teamId = chosenCompleteAssessmentTask["team_id"];
                        singleUnitData[teamId] = data; 
                        singleTeam.push(teams.filter(team => team["team_id"] === teamId)[0]);
                    } else {
                        var CATuserId = chosenCompleteAssessmentTask["user_id"];
                        singleUnitData[CATuserId] = data;  
                        singleUser.push(users.filter(user => user["user_id"] === CATuserId)[0]);
                    } 
                } else {
                    // new student assessment
                    if (this.state.unitOfAssessment)  { 
                        var teamId = team[0]["team_id"];
                        singleUnitData[teamId] = data;
                        singleTeam.push(teams.filter(team => team["team_id"] === teamId)[0]);   
                    }  else {
                        singleUnitData[this.userId] = data; 
                        singleUser.push(users.filter(user => user["user_id"] === this.userId)[0]);
                    }
                }
            } else {
                // If the user is a TA or Admin, this returns assessments completed by the TA
                var initialUnitData = {};
                if (this.state.unitOfAssessment) { 

                    Object.keys(teams).forEach((teamId) => {
                        var t_id = teams[teamId].team_id;
                        var complete = this.getCompleteTeam(t_id);
                        if (complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null && 
                                                this.doRubricsForCompletedMatch(json, complete["rating_observable_characteristics_suggestions_data"])) {
                            complete["rating_observable_characteristics_suggestions_data"]["done"] = complete["done"];

                            initialUnitData[t_id] = complete["rating_observable_characteristics_suggestions_data"];

                        } else {
                            initialUnitData[t_id] = json;
                        }
                        //return initialUnitData;
                    });
                } else {
                    if (users === null || users.length === 0) {
                        return (
                            <ErrorMessage
                                fetchedResource={"Student users for this course"}
                                errorMessage={"No users found for this course."}
                            />
                        );
                    } else {
                        users.map((user) => {
                
                            var complete = this.getCompleteIndividual(user["user_id"]);
                            if (complete !== false && complete["rating_observable_characteristics_suggestions_data"] !== null && 
                                                    this.doRubricsForCompletedMatch(json, complete["rating_observable_characteristics_suggestions_data"])) {
                                complete["rating_observable_characteristics_suggestions_data"]["done"] = this.props.userRole ? false : complete["done"];

                                initialUnitData[user["user_id"]] = complete["rating_observable_characteristics_suggestions_data"];

                            } else {
                                initialUnitData[user["user_id"]] = json;
                            }
                            //return initialUnitData;
                        });
                    }
                }
            }            

            return (
                <Box>
                    <Box className="assessment-title-spacing">
                        <Box className='d-flex flex-column justify-content-start'>
                            <h4>{rubrics["rubric_name"]}</h4>

                            <h5>{rubrics["rubric_description"]}</h5>
                        </Box>
                    </Box>

                    <Form
                        navbar={this.props.navbar}

                        unitOfAssessment={this.state.unitOfAssessment}

                        role_name={this.state.roles["role_name"]}

                        checkin={this.state.checkin}

                        form={{
                            "rubric": rubrics,
                            "units": (unitOfAssessment ? (role_name === "Student" ? singleTeam : teams) : 
                                                         (role_name === "Student" ? singleUser : users)),
                            "teams_users": teams_users,
                            "unitInfo": role_name === "Student" ? singleUnitData : initialUnitData,
                        }}

                        formReference={this}

                        handleDone={this.handleDone}

                        refreshUnits={this.refreshUnits}

                        completedAssessments={completedAssessments}
                    />
                </Box>
            )
        }
    }
}

export default CompleteAssessmentTask;
