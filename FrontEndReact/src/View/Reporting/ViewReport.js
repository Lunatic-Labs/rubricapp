import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReport extends Component {
  render() {
    var courses = this.props.courses;
    const columns = [
      {
        name: "student_name",
        label: "Student Name",
        options: {
          filter: true,
        }
      },   
      {
        name: "feedback_time_lag",
        label: "Feedback Time Lag",
        options: {
          filter: true,
        }
      },  
      {
        name: "identifying_the_goal",
        label: "Identifying the Goal",
        options: {
          filter: true,
        }
      },  
      {
        name: "evaluating",
        label: "Evaluating",
        options: {
          filter: true,
          }
      },  
      {
        name: "analyzing",
        label: "Analyzing",
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
        name: "synthesizing",
        label: "Synthesizing",
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
        name: "structure",
        label: "Forming Arguments (Structure)",
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
        name: "validity",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
          customBodyRender: (value) => {
            return(
              <p className='pt-3' variant="contained">{value===null ? "N/A": (value ? "Yes":"No")}</p>
            )
          }
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
      tableBodyMaxHeight: "70%"
    };
    return (
      <>
        <MUIDataTable data={courses ? courses[0] : []} columns={columns} options={options}/>
      </>
    )
  }
}