import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewCourses extends Component {
  render() {
    var courses = this.props.courses;
    const columns = [
      {
        name: "course_name",
        label: "Course Name",
        options: {
          filter: true,
        }
      },   
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          }
      }, 
      {
        name: "use_tas",
        label: "Use Tas",
        options : {
          filter: true,
          customBodyRender: (value) => {
            return(
              <p className="pt-3" variant="contained" align="center" >{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
            )
          }
        }
      },
      {
        name: "use_fixed_teams",
        label: "Fixed Teams",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return(
              <p className='pt-3' variant="contained" align="center" >{value===null ? "N/A": (value ? "Yes" : "No")}</p>
            )
          }
        }
      }
    ]
    // TODO: Update logic to use isAdmin attribute in User table!
    // if(this.props.role_id === 3) {
      columns.push(
        {
          // If the logged in user is an Admin in the course, they can edit the course.
          // Otherwise the edit button is disabled because they did not make the course
          // and are either a TA/Instructor or Student in the course!
          name: "course_id",
          label: "EDIT",
          options: {
            filter: true,
            sort: false,
            customBodyRender: (course_id) => {
              return (
                <button
                  id={course_id}
                  className={"editCourseButton btn btn-primary " + (this.props.courseRoles[course_id]!==3 ? "disabled" : "")}
                  onClick={
                    () => {
                      if(this.props.courseRoles[course_id]===3) {
                        this.props.navbar.setAddCourseTabWithCourse(courses, course_id, "AddCourse")
                      }
                    }
                  }>
                    Edit
                  </button>
              )
            },    
          }
        }
      );
    // }
    columns.push(
      {
        name: "course_id",
        label: "VIEW",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (course_id) => {
            return (
                <button
                  id={course_id}
                  className="editCourseButton btn btn-primary"
                  onClick={() => {
                    // The logged in user is an Admin in the course
                    if(this.props.courseRoles[course_id] === 3) {
                      this.props.navbar.setAddCourseTabWithCourse(courses, course_id, "Users");
                    // The logged in user is a TA/Instructor or Student in the course
                    } else if (this.props.courseRoles[course_id] === 4 || this.props.courseRoles[course_id] === 5) {
                      this.props.navbar.setStudentDashboardWithCourse(course_id, courses);
                    }
                  }}>
                  View
                </button>
            )
          },    
        }
      }
    );
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%"
    };
    return (
      <>
        <MUIDataTable data={courses ? courses : []} columns={columns} options={options}/>
      </>
    )
  }
}