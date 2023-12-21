import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable';


// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewCourses extends Component {

  render() {
    var navbar = this.props.navbar;
    var adminViewCourses = navbar.adminViewCourses;
    var courses = adminViewCourses.courses;
    var setAddCourseTabWithCourse = navbar.setAddCourseTabWithCourse;
    const columns = [
      {
        name: "course_name",
        label: "Course Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"178px"}},
          setCellProps: () => { return { width:"178px"} },
        }
      },   
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"183px"}},
          setCellProps: () => { return { width:"183px"} },
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px"}},
          setCellProps: () => { return { width:"140px"} },
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px"}},
          setCellProps: () => { return { width:"140px"} },
          }
      }, 
      {
        name: "use_tas",
        label: "Use Tas",
        options : {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px"}},
          setCellProps: () => { return { width:"140px"} },
          customBodyRender: (value) => {
            return(
              <p>{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
            )
          }
        }
      },
      {
        name: "use_fixed_teams",
        label: "Fixed Teams",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"140px"}},
          setCellProps: () => { return { width:"140px"} },
          customBodyRender: (value) => {
            return(
              <p>{value===null ? "N/A": (value ? "Yes":"No")}</p>
            )
          }
        }
      },
      {
        name: "course_id",
        label: "EDIT",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"140px"}},
          setCellProps: () => { return { align:"center", width:"140px"} },
          customBodyRender: (value) => {
            return (
              <IconButton id={value}
                 onClick={() => {
                  setAddCourseTabWithCourse(courses, value, "AddCourse")
              }} >
                <EditIcon sx={{color:"black"}}/>
              </IconButton>
            )
          },    
        }
      },
      {
        name: "course_id",
        label: "VIEW",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"140px"}},
          setCellProps: () => { return { align:"center", width:"140px"} },
          customBodyRender: (value) => {
            return (
                <IconButton id={value}
                   onClick={() => {
                    setAddCourseTabWithCourse(courses, value, "Users");
                }} >
                  <VisibilityIcon sx={{color:"black"}} />
                </IconButton>
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
      responsive: "standard",
      tableBodyMaxHeight: "60vh",
      // tableBodyHeight: "800px"
    };
    return (
      <>
        <CustomDataTable 
          data={courses ? courses : []} 
          columns={columns}
          options={options}
        />
      </>
    )
  }
}