import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import MUIDataTable from 'mui-datatables';

class ViewAssessmentTaskInstructions extends Component {
  render() {
     
    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "standard",
      tableBodyMaxHeight: "21rem"
    };
    return (
     <>
      <div style={{ padding: '70px', background: '#F8F8F8' }}>
        
      </div>
     </>
    )
  }
}
