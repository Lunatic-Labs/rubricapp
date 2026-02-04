import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

/**
 * Creates an instance of the AssessmentDashboard component.
 * Displays the assessment dashboard with options to manage assessment tasks.
 * 
 * @constructor
 * @param {Object} props - The properties passed to the component.
 * @property {Object} props.navbar - The navbar object containing state and methods for navigation.
 * 
 * Components Used:
 * @see MainHeader
 * @see AdminViewAssessmentTask
 * 
 * Actions:
 * - View My Custom Rubrics
 * - Import Assessment Tasks
 * - Add Task
 * 
 * Data:
 * No fetchig or managing data directly in this component.
 * - Handled by AdminViewAssessmentTask component.
 * 
 */

class AssessmentDashboard extends Component<any> {
    render() {
        var navbar = this.props.navbar;
        var setNewTab = navbar.setNewTab;

        return(
            <>
                <MainHeader
                    navbar={navbar}
                />

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label='assessmentDashboardTitle'>Assessment Tasks</Typography>

                    <Box sx={{display:"flex", gap:"20px"}}>
                        {/**
                         * @button My Custom Rubrics - Button to navigate to the user's custom rubrics.
                         * Allows users to view and manage their custom rubrics.
                         * 
                         */}
                        <Button className="primary-color" variant='contained'
                            onClick={ () => {
                                this.props.navbar.setNewTab('MyCustomRubrics');
                            }}

                            // TODO: Update Jest Tests to click on this new aria-label
                            // aria-label='customRubricButton'
                            aria-label='viewMyCustomRubricsButton'
                        >
                            My Custom Rubrics
                        </Button>
                        {/**
                         * @button Import Tasks - Button to import assessment tasks.
                         * Navigates to the ImportAssessmentTasks view for importing tasks.
                         * 
                         */}

                        <Button className='primary-color mr-1'
                                variant='contained' 
                                onClick={() => {
                                    setNewTab("ImportAssessmentTasks");
                                }}
                                aria-label='importAssessmentButton'
                        >
                            Import Tasks
                        </Button>
                            {/**
                             * @button Add Task - Button to add a new assessment task.
                             * Navigates to the AddTask view for creating a new task.
                             * 
                             */}
                        <Button className='primary-color'
                                variant='contained' 
                                onClick={() => {
                                    setNewTab("AddTask");
                                }}
                                aria-label='addTaskButton'
                        >   
                            Add Task
                        </Button>
                    </Box>
                </Box>

                <Box className="table-spacing">
                    <AdminViewAssessmentTask
                        navbar={navbar}
                        show={"AdminViewAssessmentTask"}
                    />
                </Box>
            </>
        )
    }
}

export default AssessmentDashboard;