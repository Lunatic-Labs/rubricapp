import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AdminViewUsers from '../ViewUsers/AdminViewUsers';
// import AdminViewTeams from '../ViewTeams/AdminViewTeams';
import BasicTabs from '../../../Navbar/BasicTabs';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import MainHeader from '../../../Components/MainHeader';
class RosterDashboard extends Component {
    render() {
        return(
            <React.Fragment>
                <Box>
                    <Box sx={{ 
                        display: "flex",
                        padding: "var(--2, 16px) var(--6, 48px)",
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignSelf: "stretch"}}>
                            <MainHeader 
                                course={this.props.chosenCourse["course_name"]} 
                                number={this.props.chosenCourse["course_number"]}/>
                            <BasicTabs 
                                setNewTab={this.props.setNewTab} 
                                activeTab={this.props.activeTab}
                            />
                    </Box>  
                    {/* <Box sx={{padding: "var(--2, 16px) var(--6, 48px)"}}>
                        <ViewCourses
                            courses={courses}
                            setNewTab={this.props.setNewTab}
                            setAddCourseTabWithCourse={this.props.setAddCourseTabWithCourse}
                        /> 
                    </Box> */}
                </Box>
                            {/* <h2 className='mt-3'> {this.props.chosenCourse["course_name"]} ({this.props.chosenCourse["course_number"]})</h2>
                            <AdminViewUsers
                                user={null}
                                addUser={null}
                                chosenCourse={this.props.chosenCourse}
                                setNewTab={this.props.setNewTab}
                                setAddUserTabWithUser={this.props.setAddUserTabWithUser}
                            />
                            <div className="d-flex justify-content-end gap-3">
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("ViewConsent");
                                    }}
                                >
                                   View Consent
                                </button>
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("BulkUpload");
                                    }}
                                >
                                   Bulk Upload 
                                </button>
                                <button
                                    className="mb-3 mt-3 btn btn-primary"
                                    onClick={() => {
                                        this.props.setNewTab("AddUser");
                                    }}
                                    >
                                    Add User
                                </button>
                            </div>
                     */}
            </React.Fragment>
        )
    }
}

export default RosterDashboard;