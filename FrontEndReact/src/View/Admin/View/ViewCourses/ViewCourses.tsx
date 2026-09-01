import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable';
import { Typography, Box} from "@mui/material";
import Cookies from 'universal-cookie';
import { GridColDef } from '@mui/x-data-grid';

interface ViewCoursesProps {
    navbar: any;
}

class ViewCourses extends Component<ViewCoursesProps> {
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
    const roleTA = 4;
    const roleStudent = 5;
    const roleAdmin = 3;

    const columns: GridColDef[] = [
      {
        field: "course_name",
        headerName: "Course Name",
        flex: 25,
        renderCell: (params) => (
          <Typography
            sx={{fontSize: "1.6rem"}}
            aria-label={ params.value }
          >
            { params.value }
          </Typography>
        )
      },
      {
        field: "course_number",
        headerName: "Course Number",
        flex: 15,
      },
      {
        field: "term",
        headerName: "Term",
        flex: 10,
      },
      {
        field: "year",
        headerName: "Year",
        flex: 7,
      },
      {
        field: "use_tas",
        headerName: "Use T.A's",
        flex: 6,
        renderCell: (params) => (
          <>{ params.value===null ? "N/A" : (params.value ? "Yes" : "No") }</>
        )
      },
      {
        field: "use_fixed_teams",
        headerName: "Fixed Teams",
        flex: 7,
        renderCell: (params) => (
          <>{params.value===null ? "N/A": (params.value ? "Yes":"No")}</>
        )
      }];

      // If the logged in user is an Admin of at least one course then the edit column will show.
      // Otherwise the edit column will not be shown!
      if (navbar.props.isAdmin && !navbar.props.isSuperAdmin) {
        columns.push(
        {
          // If the logged in user is an Admin in the course, they can edit the course.
          // Otherwise the edit button is disabled because they did not make the course
          // and are either a TA/Instructor or Student in the course!
          field: "edit_action",
          headerName: "EDIT",
          flex: 10,
          filterable: false,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => {
            const courseId = params.row.course_id;
            return (
              <IconButton id={courseId}
              role = "img" aria-label='editCourseIconButton'
                className={"editCourseButton btn btn-primary " + (courseRoles[courseId]!==3 ? "disabled" : "")}
                onClick={() => {
                  if(courseRoles[courseId]===3) {
                    setAddCourseTabWithCourse(courses, courseId, "AddCourse")
                  }
              }}
               >
                <EditIcon sx={{color:"var(--table-text)"}}/>
              </IconButton>
            )
          },
        });
      }

      columns.push(
      {
        field: "view_action",
        headerName: "VIEW",
        flex: 10,
        filterable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const courseId = params.row.course_id;
          return (
              <IconButton id={courseId}
              role = "img" aria-label="viewCourseIconButton"
            onClick={() => {
              // Allegedly the 2 lines below are a "fix" but I have been unable to determine for what
              //    navbar.setState({ user: null, addUser: null });
              //    navbar.setAddCourseTabWithCourse(courses, courseId, "Users");
              // If viewing as student, always go to student dashboard
              if (isViewingAsStudent) {
                navbar.setStudentDashboardWithCourse(courseId, courses);
              } else if(courseRoles[courseId] === roleAdmin) { // Normal behavior based on role
                  setAddCourseTabWithCourse(courses, courseId, "Users");
              } else if (courseRoles[courseId] === roleTA || courseRoles[courseId] === roleStudent) {
                navbar.setStudentDashboardWithCourse(courseId, courses);
              } else if (navbar.props.isSuperAdmin) {
                navbar.setViewAssessmentDashboardwithCourse(courseId, courses);
              }
            }}
            >
            <VisibilityIcon sx={{color:"black"}} aria-hidden="true" />
          </IconButton>
          )
        },
    });

    const activeCourses = courses ? courses.filter((course: any) => course.active) : [];
    const inactiveCourses = courses ? courses.filter((course: any) => !course.active) : [];

    return (
      <Box aria-label="viewCourseDiv">
        <Box className="page-spacing">
          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            alignSelf: "stretch",
            
            setFilterChipProps: () => ({
              sx: {
                
                backgroundColor: 'var(--dropdown-bg)',
                color: 'var(--dropdown-text)',
              }
            }),
            setTableProps: () => ({
              sx: {
                
                '& .MuiPopover-paper': {
                  backgroundColor: 'var(--dropdown-bg)',
                  color: 'var(--dropdown-text)',
                },
                '& .MuiTableCell-root': {
                  color: 'var(--dropdown-text)',
                },
                '& .MuiCheckbox-root': {
                  color: 'var(--dropdown-icon)',
                },
                '& .MuiInput-root': {
                  color: 'var(--dropdown-text)',
                },
                '& .MuiInput-underline:before': {
                  borderBottomColor: 'var(--dropdown-border)',
                },
                '& .MuiTypography-root': {
                  color: 'var(--dropdown-text)',
                },
                '& .MuiButton-root': {
                  color: 'var(--button-text)',
                },
              }
            }),
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
              getRowId={(row) => row.course_id}
              height="35vh"
            />
          </Box>
        </Box>

        {navbar.props.isAdmin && (
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
                getRowId={(row) => row.course_id}
                height="35vh"
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }
}

export default ViewCourses;
