// @ts-expect-error TS(2307): Cannot find module 'react' or its corresponding ty... Remove this comment to see the full error message
import React, { Component } from 'react';
// @ts-expect-error TS(2307): Cannot find module '@mui/material/IconButton' or i... Remove this comment to see the full error message
import IconButton from '@mui/material/IconButton';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Edit' or i... Remove this comment to see the full error message
import EditIcon from '@mui/icons-material/Edit';
// @ts-expect-error TS(2307): Cannot find module '@mui/icons-material/Visibility... Remove this comment to see the full error message
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable.js';
// @ts-expect-error TS(2307): Cannot find module '@mui/material' or its correspo... Remove this comment to see the full error message
import { Typography, Box } from "@mui/material";

class ViewCourses extends Component {
  props: any;
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
          customBodyRender: (courseName: any) => {
            return(
              // @ts-expect-error TS(2307): Cannot find module 'react/jsx-runtime' or its corr... Remove this comment to see the full error message
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
        label: "Use T.A's",
        options : {
          filter: true,
          setCellHeaderProps: () => { return { width:"6%" } },
          setCellProps: () => { return { width:"6%" } },
          customBodyRender: (value: any) => {
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
          customBodyRender: (value: any) => {
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
            // @ts-expect-error TS(2322): Type '{ filter: false; sort: false; setCellHeaderP... Remove this comment to see the full error message
            sort: false,
            setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
            setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
            customBodyRender: (courseId) => {
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
          // @ts-expect-error TS(2322): Type '{ filter: false; sort: false; setCellHeaderP... Remove this comment to see the full error message
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
          setCellProps: () => { return { align:"center", width:"10%", className:"button-column-alignment" } },
          customBodyRender: (courseId) => {
            return (
                <IconButton id={courseId}
                role = "img" aria-label="viewCourseIconButton"
                   onClick={() => {
                    // The logged in user is an Admin in the course
                    if(courseRoles[courseId] === 3) {
                      setAddCourseTabWithCourse(courses, courseId, "Users");

                    // The logged in user is a TA/Instructor or Student in the course
                    } else if (courseRoles[courseId] === 4 || courseRoles[courseId] === 5) {
                      navbar.setStudentDashboardWithCourse(courseId, courses);
                    }
                }}
                >
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

    const activeCourses = courses ? courses.filter((course: any) => course.active) : [];
    const inactiveCourses = courses ? courses.filter((course: any) => !course.active) : [];

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