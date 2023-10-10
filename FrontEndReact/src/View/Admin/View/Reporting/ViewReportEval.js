import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';
import { API_URL } from '../../../../App';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins


export default class ViewReportEval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportList: null
    }
  }
  componentDidMount () {
    fetch(API_URL + '/completed_assessment')
    .then(res => res.json())
    .then(
      (result) => {
        if(result["success"]) {
          console.log(
            result['content']['completed_assessments'][0]
          );
        } else {
          console.log("ERROR!");
        }
      },
      (error) => {
        console.log(error);
      }
    )
  }
  render() {
    var reports = this.props.reports;
    const columns = [
      {
        name: "first_name",
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
        "first_name": "Student 1" ,
        "identifying_the_goal":"5" ,
        "evaluating": "3" ,
        "analyzing": "5" ,
        "synthesizing": "4" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "first_name": "Student 2" ,
        "identifying_the_goal":"5" ,
        "evaluating": "2" ,
        "analyzing": "5" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"1"
      },
      {
        "first_name": "Student 3" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "3" ,
        "synthesizing": "5" ,
        "structure": "5" ,
        "validity":"4"
      },
      {
        "first_name": "Student 4" ,
        "identifying_the_goal":"5" ,
        "evaluating": "5" ,
        "analyzing": "3" ,
        "synthesizing": "3" ,
        "structure": "5" ,
        "validity":"5"
      },
      {
        "first_name": "Student 5" ,
        "identifying_the_goal":"5" ,
        "evaluating": "4" ,
        "analyzing": "5" ,
        "synthesizing": "4" ,
        "structure": "4" ,
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
