import React, { Component } from 'react';
import ViewCompleteTeamAssessmentTasks from "./ViewCompleteTeamAssessmentTasks";
import ViewCompleteIndividualAssessmentTasks from "./ViewCompleteIndividualAssessmentTasks";
import ErrorMessage from '../../../Error/ErrorMessage';
import { genericResourceGET, parseUserNames, parseRoleNames } from '../../../../utility';
import { Box } from '@mui/material';
import Loading from '../../../Loading/Loading';

interface AdminViewCompleteAssessmentTasksProps {
    navbar: any;
}

interface AdminViewCompleteAssessmentTasksState {
    errorMessage: any;
    isLoaded: boolean;
    completedAssessments: any | null;
    roles: any | null;
    users: any | null;
}

class AdminViewCompleteAssessmentTasks extends Component<
    AdminViewCompleteAssessmentTasksProps,
    AdminViewCompleteAssessmentTasksState
> {
    constructor(props: AdminViewCompleteAssessmentTasksProps) {
        super(props);

        this.state = {
            errorMessage: null,
            isLoaded: false,
            completedAssessments: null,
            roles: null,
            users: null,
        };
    }

    componentDidMount() {
        const navbar = this.props.navbar;
        const state = navbar.state;
        const chosenAssessmentTask = state.chosenAssessmentTask;
        const chosenCourse = state.chosenCourse;

        if (chosenAssessmentTask["unit_of_assessment"]) {
            // Fetch Team assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=team`,
                "completed_assessments",
                this as any,
                { dest: "completedAssessments" }
            );
        } else {
            // Fetch Individual assessments
            genericResourceGET(
                `/completed_assessment?assessment_task_id=${chosenAssessmentTask["assessment_task_id"]}&unit=individual`,
                "completed_assessments",
                this as any,
                { dest: "completedAssessments" }
            );
        }

        genericResourceGET(`/role`, 'roles', this as any);

        if (chosenCourse) {
            genericResourceGET(
                `/user?course_id=${chosenCourse["course_id"]}`,
                'users',
                this as any
            );
        }
    }

    render() {
        const { errorMessage, isLoaded, completedAssessments, roles, users } = this.state;

        const navbar = this.props.navbar;
        const unitOfAssessment = navbar.state.chosenAssessmentTask["unit_of_assessment"];

        // Keep existing app pattern: store parsed lookups on navbar for children to use
        navbar.adminViewCompleteAssessmentTasks = {};
        navbar.adminViewCompleteAssessmentTasks.completeAssessmentTasks = completedAssessments;
        navbar.adminViewCompleteAssessmentTasks.roleNames = roles ? parseRoleNames(roles) : [];
        navbar.adminViewCompleteAssessmentTasks.userNames = users ? parseUserNames(users) : [];

        if (errorMessage) {
            return (
                <div className='container'>
                    <ErrorMessage errorMessage={errorMessage} />
                </div>
            );
        }

        if (!isLoaded || !completedAssessments || !roles || !users) {
            return <Loading />;
        }

        if (unitOfAssessment) {
            return (
                <Box>
                    <ViewCompleteTeamAssessmentTasks
                        navbar={navbar}
                        completedAssessment={completedAssessments}
                    />
                </Box>
            );
        }

        return (
            <Box>
                <ViewCompleteIndividualAssessmentTasks
                    navbar={navbar}
                    completedAssessment={completedAssessments}
                />
            </Box>
        );
    }
}

export default AdminViewCompleteAssessmentTasks;
