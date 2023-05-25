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
        name: "admin_id",
        label: "Admin ID",
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
              <p className="pt-3" variant="contained">{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
            )
          }
        }
      },
      {
        name: "use_fix_teams",
        label: "Use Fixed Teams",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return(
              <p className='pt-3' variant="contained">{value===null ? "N/A": (value ? "Yes":"No")}</p>
            )
          }
        }
      },
      {
        name: "course_id",
        label: "Edit",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return (
              <button
                id={value}
                className="editCourseButton btn btn-primary"
                onClick={
                  () => {
                    this.props.setAddCourseTabWithCourse(courses[0], value, "AddCourse")
                  }
                }>
                  Edit
                </button>
            )
          },    
        }
      },
      {
        name: "course_id",
        label: "View",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return (
                //We need to make this button to take us to the Admin Dashboard for a specific course. The tables should only display the teams and assesment tasks associated to that course
                <button
                  id={value}
                  className="editCourseButton btn btn-primary"
                  onClick={() => {
                    this.props.setAddCourseTabWithCourse(courses[0], value, "AdminDashboard")
                  }}>
                  View
                </button>
            )
          },    
        }
      }
    ]
    
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical"
    };
    return (
      <>
        <MUIDataTable data={courses[0]} columns={columns} options={options}/>
      </>
    )
  }
}