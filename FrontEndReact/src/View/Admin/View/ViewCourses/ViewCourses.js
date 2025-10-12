import React, { Component } from 'react';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

class ViewCourses extends Component {
  // ... other component code above unchanged ...

  render() {
    const { courses, courseRoles, setAddCourseTabWithCourse, navbar } = this.props;

    const columns = [
      // ... other columns ...
      {
        name: "use_tas",
        label: "Use T.A.s",
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
          setCellHeaderProps: () => { return { width: "6%" } },
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
                  disabled={courseRoles[courseId] !== 3}
                  onClick={() => {
                    if(courseRoles[courseId]===3) {
                      setAddCourseTabWithCourse(courses, courseId, "AddCourse")
                    }
                }}
                  aria-label={`Edit course`}
                 >
                  <EditIcon sx={{color:"black"}} aria-hidden="true"/>
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
                aria-label={`View course`}>
                  <VisibilityIcon sx={{color:"black"}} aria-hidden="true" />
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

    // ... some code omitted for brevity ...

    return (
      // ... surrounding table rendering ...
      // inside a customBodyRender for edit button
      <IconButton
        id={/* courseId placeholder - actual render provides courseId */}
        aria-label="Edit course"
        className="editCourseButton btn btn-primary"
        disabled={courseRoles && courseRoles[/* courseId placeholder */] !== 3}
        onClick={() => {
          const courseId = /* courseId placeholder - actual render provides courseId */ null;
          if (courseRoles && courseRoles[courseId] === 3) {
            setAddCourseTabWithCourse(courses, courseId, "AddCourse");
          }
        }}
      >
        <EditIcon sx={{ color: "black" }} />
      </IconButton>

      // inside a customBodyRender for view button
      <IconButton
        id={/* courseId placeholder - actual render provides courseId */}
        aria-label="View course"
        disabled={courseRoles && courseRoles[/* courseId placeholder */] !== 3}
        onClick={() => {
          const courseId = /* courseId placeholder - actual render provides courseId */ null;
          if (courseRoles && courseRoles[courseId] === 3) {
            navbar.setStudentDashboardWithCourse(courseId, courses);
          }
        }}
      >
        <VisibilityIcon sx={{ color: "black" }} />
      </IconButton>

      // ... rest of render ...
    );
  }
}

export default ViewCourses