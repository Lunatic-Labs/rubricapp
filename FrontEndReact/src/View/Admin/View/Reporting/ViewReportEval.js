import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins


export default class ViewReportEval extends Component {
  render() {
    var reports = this.props.reports;
    const columns = [
      {
        name: "student_name",
        label: "Student Name",
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
        }
      },
      {
        name: "synthesizing",
        label: "Synthesizing",
        options: {
          filter: true,
        }
      },
      {
        name: "structure",
        label: "Forming Arguments (Structure)",
        options: {
          filter: true,
        }
      },
      {
        name: "validity",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
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
    const students = [
      {
        "student_name": "Student 1" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "student_name": "Student 2" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "student_name": "Student 3" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "student_name": "Student 4" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "student_name": "Student 5" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"5"
      },
    ];
    return (
      <>
       <MUIDataTable data={students} columns={columns} options={options}/>
      </>
    )
  }
}
