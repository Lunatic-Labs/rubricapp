import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { ThemeProvider } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';
import { createTheme } from '@mui/material/styles';
// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewCourses extends Component {
  getMuiTheme = () =>
  createTheme({
    components: {
      MUIDataTableBodyCell:{
        styleOverrides: {
        root:{
          fontSize:"16px"
        }
      },
      },
      MUIDataTableToolbar: {
        styleOverrides: {
          root: {
            backgroundColor: "white",
          },
        },
      },
      MuiButtonBase:{
        styleOverrides: {
          root:{
            fontSize:"2rem"
          },
        },
      },
      MUIDataTableHeadCell: {
        styleOverrides: {
          root:{
            backgroundColor: "#2E8BEF80",
          }
        },
      },
      // MUITableCell: {
      //   styleOverrides: {
      //     root:{
      //       width:"150px",
      //     }
      //   },
      // },
      MUIDataTableHead: {
        styleOverrides: {
          root:{
            display: "flex",
            flexDirection:"row",
            justifyContent: 'space-around' ,
            
          }
        },
      },
    },
  });

  render() {
    var courses = this.props.courses;
    const columns = [
      {
        name: "course_name",
        label: "Course Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
        }
      },   
      {
        name: "course_number",
        label: "Course Number",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
        }
      },  
      {
        name: "term",
        label: "Term",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
        }
      },  
      {
        name: "year",
        label: "Year",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
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
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
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
          setCellHeaderProps: () => { return { width:"168px"}},
          setCellProps: () => { return { width:"168px"} },
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
          setCellHeaderProps: () => { return { align:"center", width:"140px"}},
          setCellProps: () => { return { align:"center"} },
          customBodyRender: (value) => {
            return (
              <button
                id={value}
                className="editCourseButton btn btn-primary"
                onClick={
                  () => {
                    this.props.setAddCourseTabWithCourse(courses[0], value, "AddCourse")
                    //console.log(courses[0])
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
        label: "VIEW",
        options: {
          filter: true,
          sort: false,
          setCellHeaderProps: () => { return { align:"center", width:"140px"}},
          setCellProps: () => { return { align:"center", width:"168px"} },
          customBodyRender: (value) => {
            return (
                //We need to make this button to take us to the Admin Dashboard for a specific course. The tables should only display the teams and assesment tasks associated to that course
                <button
                  id={value}
                  className="editCourseButton btn btn-primary"
                  onClick={() => {
                    // this.props.setAddCourseTabWithCourse(courses[0], value, "AdminDashboard")
                    this.props.setAddCourseTabWithCourse(courses[0], value, "Users")
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
      responsive: "standard",
      tableBodyMaxHeight: "70%",
      // tableBodyHeight: "800px"
    };
    return (
      <>
      <ThemeProvider theme={this.getMuiTheme()}>
      <MUIDataTable data={courses ? courses[0] : []} columns={columns} options={options}/> 
      </ThemeProvider>
        
      </>
    )
  }
}