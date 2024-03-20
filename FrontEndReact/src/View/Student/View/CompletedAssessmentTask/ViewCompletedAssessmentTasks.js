import React, { Component } from "react"
import 'bootstrap/dist/css/bootstrap.css';
import CustomDataTable from "../../../Components/CustomDataTable";



class ViewCompletedAssessmentTasks extends Component{
  render() {

    var completedAssessments = this.props.completedAssessments;

    const columns = [
      {
        name: "assessment_task_name",
        label: "Team Name",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px"}},
          setCellProps: () => { return { width:"230px"} },
        }
      },
      {
        name: "initial_time",
        label: "Initial Time",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"230px"}},
          setCellProps: () => { return { width:"230px"} },
        }
      },
      {
        name: "last_update",
        label: "Last Update",
        options: {
          filter: true,
          setCellHeaderProps: () => { return { width:"160px"}},
          setCellProps: () => { return { width:"160px"} },
        }
      },
    ];

    const options = {
      onRowsDelete: false,
      download: false,
      print: false,
      viewColumns : false,
      selectableRows: "none",
      selectableRowsHeader: false,
      responsive: "vertical",
      tableBodyMaxHeight: "21rem"
    };

    return (
      <CustomDataTable
        data={completedAssessments ? completedAssessments:[]}
        columns={columns}
        options={options}
      />
    )
  }
}

export default ViewCompletedAssessmentTasks;