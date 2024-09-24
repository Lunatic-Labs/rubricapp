import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable.js';
import { Typography, Box } from "@mui/material";

class ViewCourses extends Component {
  render() {
    var navbar = this.props.navbar;
    var adminViewCourses = navbar.adminViewCourses;
    var courses = adminViewCourses.courses;
    var courseRoles = adminViewCourses.courseRoles;
    var setAddCourseTabWithCourse = navbar.setAddCourseTabWithCourse;

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
      }];

      // If the logged in user is an Admin of at least one course then the edit column will show.
      // Otherwise the edit column will not be shown!
      if (navbar.props.isAdmin) {
        columns.push(
        {
          // If the logged in user is an Admin in the course, they can edit the course.
          // Otherwise the edit button is disabled because they did not make the course
          // and are either a TA/Instructor or Student in the course!
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

      columns.push(
      {
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
                    // The logged in user is an Admin in the course
                    if(courseRoles[courseId] === 3) {
                      setAddCourseTabWithCourse(courses, courseId, "Users");

                    // The logged in user is a TA/Instructor or Student in the course
                    } else if (courseRoles[courseId] === 4 || courseRoles[courseId] === 5) {
                      navbar.setStudentDashboardWithCourse(courseId, courses);
                    }
                }}
                aria-label="viewCourseIconButton">
                  <VisibilityIcon sx={{color:"black"}} />
                </IconButton>
            )
          },
        }
    });

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