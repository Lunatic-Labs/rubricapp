import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReportStudent extends Component {
    render() {
      var reports = this.props.reports;
      console.log(reports);
      const columns = [
        {
          name: "student_name",
          label: "Student Name",
          options: {
            filter: true,
          }
        },  
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
          "student_name": "Student 1"
        },
        {
          "student_name": "Student 2"
        },
        {
          "student_name": "Student 3"
        },
        {
          "student_name": "Student 4"
        },
        {
          "student_name": "Student 5"
        },
      ];
      return (
        <>
          {/* <MUIDataTable data={reports ? reports[0] : []} columns={columns} options={options}/> */}
          <MUIDataTable data={students} columns={columns} options={options}/>
        </>
      )
    }
  }   