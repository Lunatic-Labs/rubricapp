import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
// import AdminDashboard from './AdminDashboard';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewCourses extends Component {
  render() {
    var courses = this.props.courses;
    const columns = [
      // The name is the accessor for the json object. 
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
        name: "course_id",
        label: "Edit",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (value) => {
            return (
              // Request to edit page with unique ID here!!!
              // <EditUserModal user_id={value} users={users}/>

              //We need this button to pull the current course information and redirect to the edit course page. (super similar to the edit user page & functionality)
              <button
                id={value}
                className="editCourseButton btn btn-primary"
                onClick={
                  () => {
                    this.props.setAddCourseTabWithCourse(courses[0], value)
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
                // Request to edit page with unique ID here!!!
                //<AdminDashboard course_id={value}/>

                //We need to make this button to take us to the Admin Dashboard for a specific course. The tables should only display the teams and assesment tasks associated to that course
                <button
                  id={value}
                  className="editCourseButton btn btn-primary"
                  onClick={
                    () => {
                      this.props.setAddCourseTabWithCourse(courses[0], value)
                    }
                  }>
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
      // There are different options for the responsiveness, I just chose this one. 
      // responsive: "standard"
      // responsive: "simple"
      responsive: "vertical"
    };
    return (
      <>
        <MUIDataTable data={courses[0]} columns={columns} options={options}/>
      </>
    )
  }
}