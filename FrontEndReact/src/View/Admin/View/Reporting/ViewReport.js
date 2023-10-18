import React, { Component } from 'react';
import MUIDataTable from 'mui-datatables';

// THE LINK FOR THIS LIBRARY 
// https://www.npmjs.com/package/mui-datatables#available-plug-ins

export default class ViewReport extends Component {
  render() {
    const columns = [
      {
        name: "first_name",
        label: "Student Name",
        options: {
          filter: true,
        }
      },  
      // {
      //   name: "feedback_time_lag",
      //   label: "Feedback Time Lag",
      //   options: {
      //     filter: true,
      //   }
      // },
      {
        name: "Identifying the Goal",
        label: "Identifying the Goal",
        options: {
          filter: true,
          // customBodyRender: (
          //   (identifying_the_goal) => {
          //     return(
          //       <p>{identifying_the_goal["rating"]}</p>
          //     )
          //   }
          // )
        }
      },  
      {
        name: "Evaluating",
        label: "Evaluating",
        options: {
          filter: true,
          }
      },  
      {
        name: "Analyzing",
        label: "Analyzing",
        options : {
          filter: true,
        }
      },
      {
        name: "Synthesizing",
        label: "Synthesizing",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Structure)",
        label: "Forming Arguments (Structure)",
        options: {
          filter: true,
        }
      },
      {
        name: "Forming Arguments (Validity)",
        label: "Forming Arguments (Validity)",
        options: {
          filter: true,
        }
      }
    ]
    const options= {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "70%",
    };
    return (
      <>
       <MUIDataTable data={this.props.ratings ? this.props.ratings : []} columns={columns} options={options}/>
      </>
    )
  }
}
