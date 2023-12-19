import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class AssessmentDashboard extends Component {
    render() {
        var navbar = this.props.navbar;
        var setNewTab = navbar.setNewTab;
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <MainHeader
                        navbar={navbar}
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Assessment Tasks</Typography>
                        <Box sx={{display:"flex", gap:"20px"}}>
                            <Button className='primary-color mr-1'
                                    variant='contained' 
                                    onClick={() => {
                                        setNewTab("ImportAssessmentTasks");
                                    }}
                            >
                                Import Tasks
                            </Button>
                            <Button className='primary-color'
                                    variant='contained' 
                                    onClick={() => {
                                        setNewTab("AddTask");
                                    }}
                            >   
                                Add Task
                            </Button>
                        </Box>
                    </Box>
                    <Box className="table-spacing">
                        <AdminViewAssessmentTask
                            navbar={navbar}
                        />
                    </Box> 
                </Box>     
            </React.Fragment>
        )
    }
}

export default AssessmentDashboard;