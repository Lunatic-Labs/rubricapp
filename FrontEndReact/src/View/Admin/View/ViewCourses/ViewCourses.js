import React, { Component } from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CustomDataTable from '../../../Components/CustomDataTable';


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
          setCellHeaderProps: () => { return { width:"148px"}},
          setCellProps: () => { return { width:"148px"} },
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"148px"}},
          setCellProps: () => { return { width:"148px"} },
          }
      }, 
      // The admin_id is the user that is logged in, hence we do not need to show to the logged in user!
      // {
      //   name: "admin_id",
      //   label: "Admin ID",
      //   options: {
      //     filter: true,
      //     }
      // }, 
      {
        name: "use_tas",
        label: "Use Tas",
        options : {
          filter: true,
          setCellHeaderProps: () => { return { width:"142px"}},
          setCellProps: () => { return { width:"142px"} },
          customBodyRender: (value) => {
            return(
              <p className="pt-3" variant="contained">{ value===null ? "N/A" : (value ? "Yes" : "No") }</p>
            )
          }
        }
      },
      {
        name: "use_fixed_teams",
        label: "Fixed Teams",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"90px"}},
          setCellProps: () => { return { width:"90px"} },
          customBodyRender: (value) => {
            return(
              <p className='pt-3' variant="contained">{value===null ? "N/A": (value ? "Yes":"No")}</p>
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
          setCellHeaderProps: () => { return { align:"center", width:"116px"}},
          setCellProps: () => { return { align:"center", width:"116px"} },
          customBodyRender: (value) => {
            return (
              <IconButton id={value}
                 onClick={() => {
                  this.props.setAddCourseTabWithCourse(courses[0], value, "AddCourse")
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
          setCellHeaderProps: () => { return { align:"center", width:"101px"}},
          setCellProps: () => { return { align:"center", width:"101px"} },
          customBodyRender: (value) => {
            return (
                //We need to make this button to take us to the Admin Dashboard for a specific course. The tables should only display the teams and assesment tasks associated to that course
                <IconButton id={value}
                   onClick={() => {
                    this.props.setAddCourseTabWithCourse(courses[0], value, "AdminDashboard")
                    this.props.setAddCourseTabWithCourse(courses[0], value, "Users")
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
      tableBodyMaxHeight: "70%",
      // tableBodyHeight: "800px"
    };
    return (
      <>
        <CustomDataTable 
          data={courses ? courses[0] : []} 
          columns={columns}
          options={options}
        />
      </>
    )
  }
}