import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import AdminViewUsers from '../ViewUsers/AdminViewUsers';
// import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import AdminViewAssessmentTask from '../ViewAssessmentTask/AdminViewAssessmentTask';
import MainHeader from '../../../Components/MainHeader';
import { Box, Typography, Button } from '@mui/material';

class AssessmentDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <Box className="page-spacing">
                    <MainHeader
                        course={this.props.chosenCourse["course_name"]} 
                        number={this.props.chosenCourse["course_number"]}
                        setNewTab={this.props.setNewTab} 
                        activeTab={this.props.activeTab} 
                    />
                    <Box className="subcontent-spacing">
                        <Typography sx={{fontWeight:'700'}} variant="h5">Assessment Tasks</Typography>
                        <Box sx={{display:"flex", gap:"20px"}}>
                            <Button className='primary-color mr-1'
                                    variant='contained' 
                                    onClick={() => {
                                        this.props.setNewTab("ImportAssessmentTasks");
                                    }}
                            >
                                Import Tasks
                            </Button>
                            <Button className='primary-color'
                                    variant='contained' 
                                    onClick={() => {
                                        this.props.setNewTab("AddTask");
                                    }}
                            >   
                                Add Task
                            </Button>
                        </Box>
                    </Box>
                    <Box className="table-spacing">
                        <AdminViewAssessmentTask
                            chosenCourse={this.props.chosenCourse}
                            setNewTab={this.props.setNewTab}
                            setAddAssessmentTaskTabWithAssessmentTask={this.props.setAddAssessmentTaskTabWithAssessmentTask}
                            setCompleteAssessmentTaskTabWithID={this.props.setCompleteAssessmentTaskTabWithID}
                        />
                    </Box> 
                </Box>     
            </React.Fragment>
        )
    }
}

export default AssessmentDashboard;