import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Typography, Box, Button } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import Cookies from 'universal-cookie';
import { apiUrl } from '../../../../App.js';

class ViewCourses extends Component {
  render() {
    var navbar = this.props.navbar;
    var adminViewCourses = navbar.adminViewCourses;
    var courses = adminViewCourses.courses;
    var courseRoles = adminViewCourses.courseRoles;
    var setAddCourseTabWithCourse = navbar.setAddCourseTabWithCourse;
    
    // Initialize cookies here
    const cookies = new Cookies();
    const user = cookies.get('user');
    const isViewingAsStudent = user?.viewingAsStudent || false;

    const columns = [
      {
        name: "course_name",
        label: "Course Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"25%" } },
          setCellProps: () => { return { width:"25%" } },
          customBodyRender: (courseName) => {
            return(
              <Typography
                sx={{fontSize: "1.6rem"}}
                aria-label={ courseName }
              >
                { courseName }
              </Typography>
            )
          }
        }
      },
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"15%" } },
          setCellProps: () => { return { width:"15%" } },
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"10%" } },
          setCellProps: () => { return { width:"10%" } },
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"7%" } },
          setCellProps: () => { return { width:"7%" } },
        }
      },
      {
        name: "use_tas",
        label: "Use TA's",
        options : {
          filter: true,
          setCellHeaderProps: () => { return { width:"6%" } },
          setCellProps: () => { return { width:"6%" } },
          customBodyRender: (value) => {
            return(
              <>{ value===null ? "N/A" : (value ? "Yes" : "No") }</>
            )
          }
        }
      },
      {
        name: "use_fixed_teams",
        label: "Fixed Teams",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"7%" } },
          setCellProps: () => { return { width:"7%" } },
          customBodyRender: (value) => {
            return(
              <>{value===null ? "N/A": (value ? "Yes":"No")}</>
            )
          }
        }
      }
    ];

    // EDIT column - only show for admins not in student view
    if (navbar.props.isAdmin && !isViewingAsStudent) {
      columns.push({
        name: "course_id",
        label: "EDIT",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
          setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
          customBodyRender: (courseId) => {
            return (
              <IconButton id={courseId}
                className={"editCourseButton btn btn-primary " + (courseRoles[courseId]!==3 ? "disabled" : "")}
                onClick={() => {
                  if(courseRoles[courseId]===3) {
                    setAddCourseTabWithCourse(courses, courseId, "AddCourse")
                  }
                }}
                aria-label='editCourseIconButton'
              >
                <EditIcon sx={{color:"black"}}/>
              </IconButton>
            )
          },
        }
      });
    }

    // VIEW column - always show
    columns.push({
      name: "course_id",
      label: "VIEW",
      options: {
        filter: false,
        sort: false,
        setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
        setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
        customBodyRender: (courseId) => {
          return (
            <IconButton id={courseId}
              onClick={() => {
                // If viewing as student, always go to student dashboard
                if (isViewingAsStudent) {
                  navbar.setStudentDashboardWithCourse(courseId, courses);
                } else {
                  // Normal behavior based on role
                  if(courseRoles[courseId] === 3) {
                    setAddCourseTabWithCourse(courses, courseId, "Users");
                  } else if (courseRoles[courseId] === 4 || courseRoles[courseId] === 5) {
                    navbar.setStudentDashboardWithCourse(courseId, courses);
                  }
                }
              }}
              aria-label="viewCourseIconButton">
              <VisibilityIcon sx={{color:"black"}} />
            </IconButton>
          )
        },
      }
    });

    // STUDENT VIEW column - only for admins
    if (navbar.props.isAdmin) {
      columns.push({
        name: "course_id",
        label: "STUDENT VIEW",
        options: {
          filter: false,
          sort: false,
          setCellHeaderProps: () => { 
            return { 
              align: "center", 
              width: "10%", 
              className: "button-column-alignment" 
            } 
          },
          setCellProps: () => { 
            return { 
              align: "center", 
              width: "10%", 
              className: "button-column-alignment" 
            } 
          },
          customBodyRender: (courseId) => {
            // Only show active button for courses where user is admin and not already in student view
            if (courseRoles[courseId] === 3 && !isViewingAsStudent) {
              return (
                <IconButton
                  onClick={async () => {
                    // Store admin credentials
                    const adminCredentials = {
                      user: cookies.get('user'),
                      access_token: cookies.get('access_token'),
                      refresh_token: cookies.get('refresh_token')
                    };
                    sessionStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
                    
                    try {
                      // Get test student for this specific course
                      const response = await fetch(
                        `${apiUrl}/courses/${courseId}/test_student_token`, 
                        {
                          method: 'GET',
                          headers: {
                            'Authorization': `Bearer ${cookies.get('access_token')}`,
                            'Content-Type': 'application/json'
                          }
                        }
                      );
                      
                      if (!response.ok) {
                        throw new Error('Failed to get test student credentials');
                      }
                      
                      const data = await response.json();
                      
                      // Find course name for display
                      const courseName = courses.find(c => c.course_id === courseId)?.course_name || '';
                      
                      // Add metadata to track viewing state
                      const testStudentUser = {
                        ...data.user,
                        viewingAsStudent: true,
                        originalAdminId: adminCredentials.user.user_id,
                        viewingCourseId: courseId,
                        viewingCourseName: courseName
                      };
                      
                      // Set test student credentials
                      cookies.set('user', testStudentUser, { 
                        path: '/',
                        sameSite: 'strict' 
                      });
                      cookies.set('access_token', data.access_token, { 
                        path: '/',
                        sameSite: 'strict' 
                      });
                      cookies.set('refresh_token', data.refresh_token, { 
                        path: '/',
                        sameSite: 'strict' 
                      });
                      
                      // Reload to apply student view
                      window.location.reload();
                      
                    } catch (error) {
                      console.error('Error switching to student view:', error);
                      alert('Failed to switch to student view. Please try again.');
                    }
                  }}
                  aria-label="view as student"
                  title="View this course as a student"
                >
                  <SchoolIcon sx={{ color: "#2196f3" }} />
                </IconButton>
              );
            } else if (isViewingAsStudent) {
              // Show disabled icon when already in student view
              return (
                <IconButton disabled>
                  <SchoolIcon sx={{ color: "rgba(0, 0, 0, 0.26)" }} />
                </IconButton>
              );
            } else {
              // Not an admin in this course
              return null;
            }
          }
        }
      });
    }

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "35vh",
    };

    const activeCourses = courses ? courses.filter(course => course.active) : [];
    const inactiveCourses = courses ? courses.filter(course => !course.active) : [];

    return (
      <Box aria-label="viewCourseDiv">
        {/* Switch Back button - shows when viewing as student */}
        {isViewingAsStudent && (
          <Box sx={{ 
            mb: 2, 
            p: 2,
            backgroundColor: '#e3f2fd',
            borderRadius: 1,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography sx={{ color: '#1565c0' }}>
              <SchoolIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Viewing as Test Student
              {user?.viewingCourseName && ` for ${user.viewingCourseName}`}
            </Typography>
            <Button
              className='secondary-color'
              variant='contained'
              onClick={() => {
                // Retrieve admin credentials from sessionStorage
                const adminCredentials = JSON.parse(sessionStorage.getItem('adminCredentials'));
                
                if (adminCredentials) {
                  // Restore admin credentials
                  cookies.set('user', adminCredentials.user, {
                    path: '/',
                    sameSite: 'strict'
                  });
                  cookies.set('access_token', adminCredentials.access_token, {
                    path: '/',
                    sameSite: 'strict'
                  });
                  cookies.set('refresh_token', adminCredentials.refresh_token, {
                    path: '/',
                    sameSite: 'strict'
                  });
                  
                  // Clear temporary storage
                  sessionStorage.removeItem('adminCredentials');
                  
                  // Force re-render
                  window.location.reload();
                } else {
                  alert('Unable to switch back. Please log in again.');
                  window.location.href = '/login';
                }
              }}
              aria-label='switch back to admin'
            >
              Switch Back to Admin
            </Button>
          </Box>
        )}

        {/* Active Courses Section */}
        <Box className="page-spacing">
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch"
          }}>
            <Box sx={{ width: "100%" }} className="content-spacing">
              <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="activeCourses">
                Active Courses
              </Typography>
            </Box>
          </Box>

          <Box>
            <CustomDataTable
              data={activeCourses}
              columns={columns}
              options={options}
            />
          </Box>
        </Box>

        {/* Inactive Courses Section - only show for admins not in student view */}
        {navbar.props.isAdmin && !isViewingAsStudent && (
          <Box className="page-spacing">
            <Box sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              alignSelf: "stretch"
            }}>
              <Box sx={{ width: "100%" }} className="content-spacing">
                <Typography sx={{ fontWeight: '700' }} variant="h5" aria-label="inactiveCourses">
                  Inactive Courses
                </Typography>
              </Box>
            </Box>

            <Box>
              <CustomDataTable
                data={inactiveCourses}
                columns={columns}
                options={options}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default ViewCourses;