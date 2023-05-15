import React from 'react';
import MUIDataTable from 'mui-datatables';
import EditCourseModal from './EditCourseModal';
import AdminDashboard from './AdminDashboard';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

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
    label: "Admin_ID",
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
            <EditCourseModal course_id={value}/>
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
            <AdminDashboard course_id={value}/>
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
  responsive: "simple"
  // responsive: "vertical"
};

export default function ViewCourses(courses){
  return (
    <MUIDataTable data={courses.courses.courses} columns={columns} options={options}/>
  )
}