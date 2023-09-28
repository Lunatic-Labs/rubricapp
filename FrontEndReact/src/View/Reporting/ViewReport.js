import React, { Component } from 'react';
import { Dropdown } from 'bootstrap';
import 'react-dropdown/style.css';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReport extends Component {
  render() {
    var courses = this.props.courses;
    console.log(courses);
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
    // const optionsDropdown = [

    // ];
    // const defaultOption = options[0];
    const studentData = [
      {
        "student_name": "Student 1",
        "feedback_time_lag": 1,
        "identifying_the_goal": 1,
        "evaluating": 1,
        "analyzing": 1,
        "synthesizing": 1,
        "structure": 1,
        "validity": 1
      }
    ];
    return (
      <>
        {/* <Dropdown options={options} onChange={this._onSelect} value={defaultOption} placeholder="Select an option" />; */}
        <MUIDataTable data={studentData} columns={columns} options={options}/>
      </>
    )
  }
}