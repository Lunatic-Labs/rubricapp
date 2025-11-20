// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask.js';
import MainHeader from '../../../Components/MainHeader.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Box, Typography, Button } from '@mui/material';



class AssessmentDashboard extends Component {
    props: any;
    render() {
        var navbar = this.props.navbar;
        var setNewTab = navbar.setNewTab;

        return(
            // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
            <>
                <MainHeader
                    navbar={navbar}
                />

                <Box className="subcontent-spacing">
                    <Typography sx={{fontWeight:'700'}} variant="h5" aria-label='assessmentDashboardTitle'>Assessment Tasks</Typography>

                    <Box sx={{display:"flex", gap:"20px"}}>
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

                        <Button className='primary-color mr-1'
                                variant='contained' 
                                onClick={() => {
                                    setNewTab("ImportAssessmentTasks");
                                }}
                                aria-label='importAssessmentButton'
                        >
                            Import Tasks
                        </Button>

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