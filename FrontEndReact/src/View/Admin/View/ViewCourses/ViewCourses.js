import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable.js';



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
          setCellHeaderProps: () => { return { width:"178px" } },
          setCellProps: () => { return { width:"178px" } },
        }
      },
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"183px" } },
          setCellProps: () => { return { width:"183px" } },
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px" } },
          setCellProps: () => { return { width:"140px" } },
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px" } },
          setCellProps: () => { return { width:"140px" } },
        }
      },
      {
        name: "active",
        label: "Active",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px" } },
          setCellProps: () => { return { width:"140px" } },
          customBodyRender: (value) => {
            return(
              <>{ value===null ? "N/A" : (value ? "Yes" : "No") }</>
            )
          }
        }
      },
      {
        name: "use_tas",
        label: "Use TA's",
        options : {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px" } },
          setCellProps: () => { return { width:"140px" } },
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
          setCellHeaderProps: () => { return { width:"140px" } },
          setCellProps: () => { return { width:"140px" } },
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
            setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
            setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
            customBodyRender: (courseId) => {
              return (
                <IconButton id={courseId}
                  className={"editCourseButton btn btn-primary " + (courseRoles[courseId]!==3 ? "disabled" : "")}
                  onClick={() => {
                    if(courseRoles[courseId]===3) {
                      setAddCourseTabWithCourse(courses, courseId, "AddCourse")
                    }
                }} >
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
          setCellHeaderProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
          setCellProps: () => { return { align:"center", width:"140px", className:"button-column-alignment" } },
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
                }} >
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
      tableBodyMaxHeight: "60vh",
    };

    return (
      <CustomDataTable 
        data={courses ? courses : []} 
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewCourses;
